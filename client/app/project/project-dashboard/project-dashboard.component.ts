import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ProjectService } from '../project.service';
import { Project } from 'models/entities/project.model';
import { PageTitleService } from 'components/page-title/page-title.service';
import { AppQuillEditorComponent } from 'components/quill/app-quill-editor/app-quill-editor.component';
import { ObjectValidators } from 'components/validation/object-validators';
import { Observable, forkJoin, combineLatest, of, empty, never } from 'rxjs';
import { filter, map, switchMap, tap, concatMap, mergeMap, catchError } from 'rxjs/operators';
import config from '../../app.constants';
import { NotificationService } from 'components/notification/notification.service';
import { UserPermissionDataService, UserPermissions } from 'components/auth/user-permission-data.service';
import { EntityAccessListComponent } from 'components/entity/entity-access-list/entity-access-list.component';
import { ProjectDataService, DEFAULT_USER_PERMISSION } from '../project-data.service';
import { UserProjectPermission } from '../models/user-project-permission.model';

@Component({
    selector: 'project-dashboard',
    template: require('./project-dashboard.html'),
    styles: [require('./project-dashboard.scss')]
})
export class ProjectDashboardComponent implements OnInit, OnDestroy {
    private project: Observable<Project>;
    private userProjectPermission: UserProjectPermission = DEFAULT_USER_PERMISSION;
    private showEditProjectTemplate = false;

    private form: FormGroup;

    static parameters = [Router, ActivatedRoute, FormBuilder, PageTitleService,
        ProjectService, NotificationService, UserPermissionDataService,
        ProjectDataService];
    constructor(private router: Router, private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private projectService: ProjectService,
        private notificationService: NotificationService,
        private userPermissionDataService: UserPermissionDataService,
        private projectDataService: ProjectDataService) {
        this.form = formBuilder.group({
            description: ['', [
                // Validators.required,
                // ObjectValidators.jsonStringifyMinLength(config.models.insight.description.minlength),
                ObjectValidators.jsonStringifyMaxLength(config.models.project.description.maxlength)
            ]]
        });

        this.project = this.projectDataService.project();
    }

    ngOnInit() {
        this.project  // TODO: clean unsubscribe?
            .subscribe(project => {
                if (project) {
                    this.form.get('description').setValue(JSON.parse(project.description));
                }
            });

        this.projectDataService.userPermission()
            .subscribe(userProjectPermission => {
                this.userProjectPermission = userProjectPermission;
            }, err => console.error(err));
    }

    ngOnDestroy() { }

    // updateDescription(projectId): void {
    //     let description = JSON.stringify(this.form.get('description').value);
    //     this.projectService.updateProject(projectId, [
    //         { op: 'replace', path: '/description', value: description }
    //     ])
    //         .subscribe(project => {
    //             this.notificationService.info('The description has been successfully saved');
    //         }, err => console.log(err));
    // }

    deleteProject(): void {
        this.notificationService.info('Not implemented');
    }

    onEditProject(project: Project): void {
        this.showEditProjectTemplate = false;
        this.projectDataService.setProject(project);
        // console.log('onEditProject not yet implemented');
        // this.tool = { ...this.tool, ... omit(tool, 'organization')};
        this.notificationService.info('The Project has been successfully updated');
    }
}
