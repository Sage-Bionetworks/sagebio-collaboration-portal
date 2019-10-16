import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Resource } from 'models/entities/resources/resource.model';
import { State } from 'models/entities/resources/state.model';
import { Tool } from 'models/entities/tool.model';
import { NotificationService } from 'components/notification/notification.service';
import { PageTitleService } from 'components/page-title/page-title.service';
import { ResourceService } from 'components/resource/resource.service';
import { TokenService } from 'components/auth/token.service';
import { UserPermissionDataService, UserPermissions } from 'components/auth/user-permission-data.service';
import { ToolService } from '../../../app/tool/tool.service';
import config from '../../../app/app.constants';

@Component({
    selector: 'resource-page',
    template: require('./resource-page.html'),
    styles: [require('./resource-page.scss')],
    encapsulation: ViewEncapsulation.None,
})
export class ResourcePageComponent implements OnInit {
    private _resource: Resource;
    @Input() private canEdit = false;
    @Input() private canDelete = false;

    private form: FormGroup;
    private errors = {
        updateDescription: undefined,
    };
    private entityType: string;
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
        TokenService,
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

    @Input()
    set resource(resource: Resource) {
        if (resource) {
            this._resource = resource;

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

            if (resource.resourceType === 'State') {
                // TODO Refer to Enum
                this.toolService.get((<State>resource).tool).subscribe(
                    tool => {
                        this.tool = tool;
                    },
                    err => console.error(err)
                );
            }
        }
    }

    get resource(): Resource {
        return this._resource;
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
            this.resourceService.remove(resource).subscribe(() => {
                this.router.navigate(['..'], { relativeTo: this.route });
                this.notificationService.info(`The ${this.entityType} has been successfully deleted.`);
            }, err => {
                console.error(err);
                this.notificationService.error(`Unable to remove ${this.entityType}.`);
            });
        }
    }

    openInTool(resource): void {
        // TODO remove
        // Shiny DEMO: insert portal token: ?_inputs_ => ?portal_token=xxx&_inputs_
        let url = resource.url.replace('?_inputs_', `?token_portal=${this.tokenService.get()}&_inputs_`);
        window.open(url, '_blank');
    }

    open(): void {
        window.open(this.resource.url, '_blank');
    }
}
