import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ProjectService } from '../project.service';
import { Project } from 'models/entities/project.model';

@Component({
    selector: 'project-view',
    template: require('./project-view.html'),
    styles: [require('./project-view.scss')],
})
export class ProjectViewComponent {
    private _project: Project;

    static parameters = [Router];
    constructor(private router: Router) { }

    get project() {
        return this._project;
    }

    @Input()
    set project(project) {
        this._project = project;
    }
}
