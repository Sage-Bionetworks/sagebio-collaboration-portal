import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from 'models/project.model';
import { ProjectDataService } from '../project-data.service';

@Component({
    selector: 'project-settings',
    template: require('./project-settings.html'),
    styles: [require('./project-settings.scss')]
})
export class ProjectSettingsComponent {
    private project: Observable<Project>;

    static parameters = [ProjectDataService];
    constructor(private projectDataService: ProjectDataService) {

        this.project = this.projectDataService.project();
    }
}
