import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { App } from 'models/entities/app.model';
import { AppService } from '../app.service';
import config from '../../app/app.constants';

@Component({
    selector: 'discussion',
    template: require('./discussion.html'),
    styles: [require('./discussion.scss')],
})
export class DiscussionComponent implements OnInit {
    private app$: Observable<App>; // used in html
    private entityType: string; // used in html

    static parameters = [Router, AppService];
    constructor(private router: Router, private appService: AppService) {
        this.entityType = config.entityTypes.APP.value;
    }

    ngOnInit() {
        this.app$ = this.appService.getApp();
    }
}
