import { Component } from '@angular/core';
// import { InstanceSidenavService } from './instance-sidenav.service';

@Component({
    selector: 'project-sidenav',
    template: require('./project-sidenav.html'),
    styles: [require('./project-sidenav.scss')]
})
export class ProjectSidenavComponent {
    static parameters = [];
    constructor() { }
}
