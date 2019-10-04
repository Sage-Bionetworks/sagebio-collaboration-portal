import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ProjectService } from '../project.service';
import { Project } from 'models/entities/project.model';
import { PageTitleService } from 'components/page-title/page-title.service';
import { AppQuillEditorComponent } from 'components/quill/app-quill-editor/app-quill-editor.component';
import { ObjectValidators } from 'components/validation/object-validators';
import { Observable, forkJoin, combineLatest, of, empty, never, Subscription } from 'rxjs';
import { filter, map, switchMap, tap, concatMap, mergeMap, catchError } from 'rxjs/operators';
import config from '../../app.constants';
import { NotificationService } from 'components/notification/notification.service';
import { UserPermissionDataService, UserPermissions } from 'components/auth/user-permission-data.service';
import { EntityAccessListComponent } from 'components/entity/entity-access-list/entity-access-list.component';
import { ProjectDataService, DEFAULT_USER_PERMISSION } from '../project-data.service';
import { ProjectHeaderService } from '../project-header/project-header.service';
import { UserEntityPermission } from 'components/auth/user-entity-permission.model';
import { ProjectAuthorizationService } from '../project-authorization.service';

@Component({
    selector: 'project-home',
    template: require('./project-home.html'),
    styles: [require('./project-home.scss')],
})
export class ProjectHomeComponent implements OnInit, OnDestroy {
    private project$: Observable<Project>;
    private canAdminProject = false;

    private projectSub: Subscription;
    private canAdminProjectSub: Subscription;

    private userProjectPermission: UserEntityPermission = DEFAULT_USER_PERMISSION;
    private showEditProjectTemplate = false;
    private entityType = config.entityTypes.PROJECT.value;

    private form: FormGroup;

    static parameters = [
        Router,
        ActivatedRoute,
        FormBuilder,
        PageTitleService,
        ProjectService,
        ProjectAuthorizationService,
        NotificationService,
        UserPermissionDataService,
        ProjectDataService,
        ProjectHeaderService,
    ];
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private projectService: ProjectService,
        private projectAuthorizationService: ProjectAuthorizationService,
        private notificationService: NotificationService,
        private userPermissionDataService: UserPermissionDataService,
        private projectDataService: ProjectDataService,
        private projectHeaderService: ProjectHeaderService
    ) {
        this.form = formBuilder.group({
            description: [
                '',
                [
                    // Validators.required,
                    // ObjectValidators.jsonStringifyMinLength(config.models.insight.description.minlength),
                    ObjectValidators.jsonStringifyMaxLength(config.models.project.description.maxlength),
                ],
            ],
        });
    }

    ngOnInit() {
        this.project$ = this.projectDataService.project();

        this.canAdminProjectSub = this.project$
            .pipe(switchMap(project => this.projectAuthorizationService.canAdmin(project._id)))
            .subscribe(
                canAdmin => {
                    this.canAdminProject = canAdmin;
                },
                err => console.error(err)
            );

        this.projectSub = this.project$.subscribe(project => {
            if (project) {
                this.form.get('description').setValue(JSON.parse(project.description));
            }
        });
    }

    ngOnDestroy() {
        if (this.projectSub) {
            this.projectSub.unsubscribe();
        }
        if (this.canAdminProjectSub) {
            this.canAdminProjectSub.unsubscribe();
        }
    }

    // updateDescription(projectId): void {
    //     let description = JSON.stringify(this.form.get('description').value);
    //     this.projectService.updateProject(projectId, [
    //         { op: 'replace', path: '/description', value: description }
    //     ])
    //         .subscribe(project => {
    //             this.notificationService.info('The description has been successfully saved');
    //         }, err => console.log(err));
    // }

    onEditProject(project: Project): void {
        this.showEditProjectTemplate = false;
        this.projectDataService.setProject(project);
        // console.log('onEditProject not yet implemented');
        // this.tool = { ...this.tool, ... omit(tool, 'organization')};
        this.notificationService.info('The Project has been successfully updated');
    }

    getLink(): string {
        return window.location.href;
    }
}
