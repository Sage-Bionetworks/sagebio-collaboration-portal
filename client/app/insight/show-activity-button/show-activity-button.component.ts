import { Component, OnInit, Input, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';
import { Insight } from 'models/insights/insight.model';
import { InsightService } from '../insight.service';

@Component({
    selector: 'show-activity-button',
    template: require('./show-activity-button.html'),
    styles: [require('./show-activity-button.scss')],
    encapsulation: ViewEncapsulation.None
})
export class ShowActivityButtonComponent implements OnInit {
    @Input() private insight: Insight;
    @Output() click: EventEmitter<any> = new EventEmitter<any>();

    static parameters = [InsightService, SecondarySidenavService];
    constructor(
        private sidenavService: SecondarySidenavService) { }

    ngOnInit() { }

    ngOnDestroy() { }

}
