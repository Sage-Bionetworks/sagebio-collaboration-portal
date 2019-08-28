import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProjectService } from '../project.service';
import { Project } from 'models/entities/project.model';
import { PageTitleService } from 'components/page-title/page-title.service';
import { AppQuillEditorComponent } from 'components/quill/app-quill-editor/app-quill-editor.component';
import { Observable, forkJoin, combineLatest, of, empty, never } from 'rxjs';
import { filter, map, switchMap, tap, concatMap, mergeMap, catchError } from 'rxjs/operators';
import config from '../../app.constants';

@Component({
    selector: 'project-new',
    template: require('./project-new.html'),
    styles: [require('./project-new.scss')],
})
export class ProjectNewComponent implements OnInit, OnDestroy {
    private projectSpecs: any;
    private newForm: FormGroup;
    private errors = {
        newProject: undefined
    };

    @Output() newProject: EventEmitter<Project> = new EventEmitter<Project>();
    @Output() close: EventEmitter<any> = new EventEmitter<any>();

    static parameters = [Router, ActivatedRoute, FormBuilder, PageTitleService,
        ProjectService];
    constructor(private router: Router, private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private projectService: ProjectService) {

        this.projectSpecs = config.models.project;
        this.newForm = this.formBuilder.group({
            title: ['', [
                Validators.required,
                Validators.minLength(this.projectSpecs.title.minlength),
                Validators.maxLength(this.projectSpecs.title.maxlength)
            ]],
            description: ['', [
                Validators.required,
                Validators.minLength(this.projectSpecs.description.minlength),
                Validators.maxLength(this.projectSpecs.description.maxlength)
            ]],
            visibility: [this.projectSpecs.visibility.default, [
                Validators.required
            ]],
        });
    }

    ngOnInit() {
        // this.pageTitleService.title = 'New Project';

    }

    ngOnDestroy() { }

    createNewProject(): void {
        let newProject = this.newForm.value;
        newProject.description = JSON.stringify(newProject.description);
        this.projectService.create(newProject)
            .subscribe(project => {
                this.newProject.emit(project);
            }, err => {
                console.log(err);
                this.errors.newProject = err.message;
            });
    }
}
