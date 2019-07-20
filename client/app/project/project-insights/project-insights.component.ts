import { Component } from '@angular/core';

@Component({
    selector: 'project-insights',
    template: require('./project-insights.html'),
    styles: [require('./project-insights.scss')]
})
export class ProjectInsightsComponent {

    static parameters = [];
    constructor() { }
}
