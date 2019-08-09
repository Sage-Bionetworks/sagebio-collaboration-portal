import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
// import { ResourceService } from '../resource.service';
import { WebApp } from 'models/entities/resources/webapp.model';

@Component({
    selector: 'webapp-view',
    template: require('./webapp-view.html'),
    styles: [require('./webapp-view.scss')],
})
export class WebAppViewComponent {
    private _webapp: WebApp;

    static parameters = [Router];
    constructor(private router: Router) { }

    get webapp() {
        return this._webapp;
    }

    @Input()
    set webapp(webapp) {
        this._webapp = webapp;
        console.log('WEBAPP', webapp);
    }
}
