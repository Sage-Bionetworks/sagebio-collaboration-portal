import { Component } from '@angular/core';
import { ProjectSidenavService } from './project-sidenav.service';

@Component({
    selector: 'project-sidenav',
    template: require('./project-sidenav.html'),
    styles: [require('./project-sidenav.scss')]
})
export class ProjectSidenavComponent {
    static parameters = [ProjectSidenavService];
    constructor(private projectSidenavService: ProjectSidenavService) { }
}
