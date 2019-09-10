import { Component, Input, OnInit } from '@angular/core';
import { Project } from 'models/entities/project.model';
import { ProjectHeaderService } from './project-header.service';
import { ProjectHeaderButtonData } from './models/project-header-button-data.model';

@Component({
    selector: 'project-header',
    template: require('./project-header.html'),
    styles: [require('./project-header.scss')],
})
export class ProjectHeaderComponent implements OnInit {
    private _project: Project;
    private actionButtonData: ProjectHeaderButtonData; // used in html

    static parameters = [ProjectHeaderService];
    constructor(private projectHeaderService: ProjectHeaderService) {}

    ngOnInit() {
        this.projectHeaderService
            .actionButtonData()
            .subscribe(data => {
                this.actionButtonData = data;
            }, err => console.error(err));
    }

    get project(): Project {
        return this._project;
    }

    @Input()
    set project(project: Project) {
        this._project = project;
    }
}
