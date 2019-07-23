import { Component } from '@angular/core';

@Component({
    selector: 'project-resources',
    template: require('./project-resources.html'),
    styles: [require('./project-resources.scss')]
})
export class ProjectResourcesComponent {

    static parameters = [];
    constructor() { }
}
