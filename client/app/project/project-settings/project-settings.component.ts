import { Component } from '@angular/core';

@Component({
    selector: 'project-settings',
    template: require('./project-settings.html'),
    styles: [require('./project-settings.scss')]
})
export class ProjectSettingsComponent {

    static parameters = [];
    constructor() { }
}
