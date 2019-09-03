import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { map } from 'lodash';
import { Project } from 'models/entities/project.model';
import { ProjectService } from '../project.service';
import { AppQuillEditorComponent } from 'components/quill/app-quill-editor/app-quill-editor.component';
import { UrlValidators } from 'components/validation/url-validators';
// import slugify from 'slugify';
import config from '../../app.constants';

@Component({
    selector: 'project-edit',
    template: require('./project-edit.html'),
    styles: [require('./project-edit.scss')],
})
export class ProjectEditComponent implements OnInit, OnDestroy {
    private projectSpecs: any;
    private editForm: FormGroup;
    private errors = {
        editProject: undefined
    };
    @Input() project: Project;
    @Output() editProject: EventEmitter<Project> = new EventEmitter<Project>();
    @Output() close: EventEmitter<any> = new EventEmitter<any>();

    static parameters = [Router, ActivatedRoute, FormBuilder, ProjectService];
    constructor(private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private projectService: ProjectService) {
        this.projectSpecs = config.models.project;
    }

    ngOnInit() {
        if (this.project) {
            this.editForm = this.formBuilder.group({
                title: [this.project.title, [
                    Validators.required,
                    Validators.minLength(this.projectSpecs.title.minlength),
                    Validators.maxLength(this.projectSpecs.title.maxlength)
                ]],
                description: [JSON.parse(this.project.description), [
                    Validators.required,
                    Validators.minLength(this.projectSpecs.description.minlength),
                    Validators.maxLength(this.projectSpecs.description.maxlength)
                ]],
                // visibility: [this.project.visibility, [
                //     Validators.required
                // ]],
            });
        }
    }

    ngOnDestroy() { }

    onEditProject(): void {
        let editedProject = this.editForm.value;
        // editedTool.slug = slugify(this.editForm.value.name).toLowerCase();
        const patches = map(editedProject, (value, key) => ({
            op: 'replace',
            path: `/${key}`,
            value: value
        }));

        // need to convert the quill-based description
        let patchIndex = patches.findIndex(patch => patch.path === '/description');
        patches[patchIndex].value = JSON.stringify(patches[patchIndex].value);

        this.projectService.update(this.project._id, patches)
            .subscribe(project => {
                this.editProject.emit(project);
                this.close.emit(null);
            }, err => {
                console.error(err);
                this.errors.editProject = err.message || err;
            });
    }
}
