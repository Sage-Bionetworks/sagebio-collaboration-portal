import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ProjectService } from '../project.service';
import { Project } from 'models/project.model';
import { PageTitleService } from 'components/page-title/page-title.service';
import { AppQuillEditorComponent } from 'components/quill/app-quill-editor/app-quill-editor.component';
import { ObjectValidators } from 'components/validation/object-validators';
import { Observable, forkJoin, combineLatest, of, empty, never } from 'rxjs';
import { filter, map, switchMap, tap, concatMap, mergeMap, catchError } from 'rxjs/operators';
import config from '../../app.constants';
import { NotificationService } from 'components/notification/notification.service';
import { UserPermissionDataService, UserPermissions } from 'components/auth/user-permission-data.service';
import { EntityAccessListComponent } from 'components/entity/entity-access-list/entity-access-list.component';

@Component({
    selector: 'project',
    template: require('./project.html'),
    styles: [require('./project.scss')],
})
export class ProjectComponent implements OnInit, OnDestroy {
    private project: Project;
    private form: FormGroup;
    private canAdminEntity = false;

    static parameters = [Router, ActivatedRoute, FormBuilder, PageTitleService,
        ProjectService, NotificationService, UserPermissionDataService];
    constructor(private router: Router, private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private projectService: ProjectService,
        private notificationService: NotificationService,
        private userPermissionDataService: UserPermissionDataService) {
        this.form = formBuilder.group({
            description: ['', [
                // Validators.required,
                // ObjectValidators.jsonStringifyMinLength(config.models.insight.description.minlength),
                ObjectValidators.jsonStringifyMaxLength(config.models.project.description.maxlength)
            ]]
        });
    }

    ngOnInit() {
        const project$ = this.route.params.pipe(
            switchMap(res => this.projectService.getProject(res.id))
        );

        project$
            .subscribe(project => {
                this.form.get('description').setValue(JSON.parse(project.description));
                this.project = project;
            });

        combineLatest(
            project$,
            this.userPermissionDataService.getPermissions()
        )
            .subscribe(([project, permissions]) => {
                this.canAdminEntity = permissions.canAdminProject(project);
            });
    }

    ngOnDestroy() { }

    updateDescription(): void {
        let description = JSON.stringify(this.form.get('description').value);
        this.projectService.updateProject(this.project._id, [
            { op: 'replace', path: '/description', value: description }
        ])
            .subscribe(project => {
                this.notificationService.info('The description has been successfully saved');
            }, err => console.log(err));
    }
}
