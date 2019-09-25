import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from '../app.service';
import { App } from 'models/entities/app.model';
import { PageTitleService } from 'components/page-title/page-title.service';
import config from '../../app/app.constants';

@Component({
    selector: 'discussion',
    template: require('./discussion.html'),
    styles: [require('./discussion.scss')],
})
export class DiscussionComponent implements OnInit {
    private app: App;
    private entityType: string;

    static parameters = [Router, ActivatedRoute, AppService, PageTitleService];
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private appService: AppService,
        private pageTitleService: PageTitleService
    ) {
        this.entityType = config.entityTypes.APP.value;
    }

    ngOnInit() {
        this.appService.getApp()
            .subscribe(
                app => {
                    this.app = app;
                    this.pageTitleService.title = `Discussion`;
                },
                err => console.error(err)
            );
    }

    newThread(): void {
        console.log('plop');
    }
}
