import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ProjectService } from '../project.service';
import { Project } from '../../../../shared/interfaces/project.model';
import { PageTitleService } from '../../../components/page-title/page-title.service';
import { Observable, forkJoin, combineLatest, of, empty, never } from 'rxjs';
import { filter, map, switchMap, tap, concatMap, mergeMap, catchError } from 'rxjs/operators';
import { models } from '../../app.constants';

@Component({
    selector: 'project-create',
    template: require('./project-create.html'),
    styles: [require('./project-create.scss')],
})
export class ProjectCreateComponent implements OnInit, OnDestroy {
    private projectSpecs: {};
    private newForm: FormGroup;
    private errors = {
        newProject: undefined
    };
    // private submitted = false;

    @Output() newProject: EventEmitter<Project> = new EventEmitter<Project>();
    @Output() close: EventEmitter<any> = new EventEmitter<any>();

    static parameters = [Router, ActivatedRoute, FormBuilder, PageTitleService,
        ProjectService];
    constructor(private router: Router, private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private projectService: ProjectService) {

        this.projectSpecs = models.project;
        this.newForm = this.formBuilder.group({
            name: ['', [
                Validators.required,
                Validators.minLength(models.project.name.minlength),
                Validators.maxLength(models.project.name.maxlength)
            ]],
            description: ['', [
                Validators.required,
                Validators.minLength(models.project.description.minlength),
                Validators.maxLength(models.project.description.maxlength)
            ]],
            visibility: [models.project.visibility.default, [
                Validators.required
            ]],
        });
    }

    ngOnInit() {
        // this.pageTitleService.title = 'New Project';
    }

    ngOnDestroy() { }

    createNewProject(): void {
        // this.submitted = true;

        let newProject = this.newForm.value;
        this.projectService.create(newProject)
            .subscribe(project => {
                this.newProject.emit(project);
            }, err => {
                console.log('ERROR', err);
                this.errors.newProject = err.message;
            });
    }
}
