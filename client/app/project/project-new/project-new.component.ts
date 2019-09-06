import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProjectService } from '../project.service';
// import { Project } from 'models/entities/project.model';
import { PageTitleService } from 'components/page-title/page-title.service';
// import { AppQuillEditorComponent } from 'components/quill/app-quill-editor/app-quill-editor.component';
// import { Observable, forkJoin, combineLatest, of, empty, never } from 'rxjs';
// import { filter, map, switchMap, tap, concatMap, mergeMap, catchError } from 'rxjs/operators';
import config from '../../app.constants';

@Component({
    selector: 'project-new',
    template: require('./project-new.html'),
    styles: [require('./project-new.scss')],
})
export class ProjectNewComponent implements OnInit {
    private projectSpecs: any;
    private newForm: FormGroup;
    private errors = {
        newProject: undefined
    };

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
        this.pageTitleService.title = 'New Project';
    }

    createNewProject(): void {
        let newProject = this.newForm.value;
        newProject.description = JSON.stringify(newProject.description);
        this.projectService.create(newProject)
            .subscribe(project => {
                this.router.navigate(['/projects', project._id]);
            }, err => {
                console.error(err);
                this.errors.newProject = err.message;
            });
    }
}
