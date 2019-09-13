import { Component, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ResourceService } from 'components/resource/resource.service';
// import { StateService } from '../../state/state.service';
import { UserPermissionDataService, UserPermissions } from 'components/auth/user-permission-data.service';

// import { EntityAttachmentMode } from 'models/entities/entity.model';
import { Resource } from 'models/entities/resources/resource.model';

import { PageTitleService } from 'components/page-title/page-title.service';
import { NotificationService } from 'components/notification/notification.service';
import { Observable, Subscription, forkJoin, of } from 'rxjs';
import { switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import config from '../../../app/app.constants';
import { ObjectValidators } from 'components/validation/object-validators';
import { ToolService } from '../../../app/tool/tool.service';
import { State } from 'models/entities/resources/state.model';
import { Tool } from 'models/entities/tool.model';
import { TokenService } from 'components/auth/token.service';

@Component({
    selector: 'resource-page',
    template: require('./resource-page.html'),
    styles: [require('./resource-page.scss')],
    // providers: [ToolService],
    encapsulation: ViewEncapsulation.None,
})
export class ResourcePageComponent implements OnInit {
    private resource: Resource;
    private form: FormGroup;
    private errors = {
        updateDescription: undefined,
    };
    private entityType: string;

    private isAdmin = false;
    private userPermissionsSub: Subscription;
    private permissions: Observable<UserPermissions>;

    private tool: Tool;

    static parameters = [
        Router,
        ActivatedRoute,
        FormBuilder,
        PageTitleService,
        ResourceService,
        ToolService,
        NotificationService,
        UserPermissionDataService,
        TokenService
    ];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private resourceService: ResourceService,
        private toolService: ToolService,
        private notificationService: NotificationService,
        private userPermissionDataService: UserPermissionDataService,
        private tokenService: TokenService
    ) {
        this.entityType = config.entityTypes.RESOURCE.value;
        this.form = formBuilder.group({
            description: ['', []],
        });

        this.router.routeReuseStrategy.shouldReuseRoute = function() {
            return false;
        };

        this.userPermissionsSub = this.userPermissionDataService.permissions().subscribe(
            userPermissions => {
                this.isAdmin = userPermissions.isAdmin();

                // TODO: Apply permissions so that users other than Admin can edit
                // if (this.isAdmin) {
                //     this.mode = EntityAttachmentMode.EDIT;
                // }
            },
            err => console.log(err)
        );

        this.route.params
            .pipe(
                switchMap(params => this.resourceService.getResource(params.resourceId)),
                switchMap(resource => forkJoin({
                    resource: of(resource),
                    tool: resource.resourceType === 'State' ? this.toolService.get((<State>resource).tool) : of(null) // TODO Hack
                }))
            )
            .subscribe((res: any) => {
                let resource = res.resource;
                this.tool = res.tool;
            // .subscribe(resource => {
                if (resource.description) {
                    // TODO: should be required
                    try {
                        this.form.get('description').setValue(JSON.parse(resource.description));
                    } catch (e) {
                        // the description is likely a string if specified from a tool
                        this.form
                            .get('description')
                            .setValue(JSON.parse(`{\"ops\":[{\"insert\":\"${resource.description}\"}]}`));
                    }
                }
                this.resource = resource;
            });
    }

    ngOnInit() {
        this.form.controls.description.valueChanges
            .pipe(
                debounceTime(50),
                distinctUntilChanged()
            )
            .subscribe(data => {
                this.errors.updateDescription = undefined;
            });
    }

    getLink(): string {
        return window.location.href;
    }

    onResourceEdit(resource: Resource): void {
        if (resource) {
            this.resource = resource;
            this.form.setValue({
                description: JSON.parse(this.resource.description),
            });
        }
    }

    deleteResource(resource: Resource): void {
        if (resource) {
            this.notificationService.info('Not implemented');
        }
    }

    openInTool(resource): void {
        window.open(resource.url, '_blank');
    }

    open(): void {
        window.open(this.resource.url, '_blank');
    }
}
