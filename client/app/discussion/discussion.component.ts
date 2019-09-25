import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from '../app.service';
import { App } from 'models/entities/app.model';
import { PageTitleService } from 'components/page-title/page-title.service';
import config from '../../app/app.constants';
import { Thread } from 'models/messaging/thread.model';

@Component({
    selector: 'discussion',
    template: require('./discussion.html'),
    styles: [require('./discussion.scss')],
})
export class DiscussionComponent implements OnInit {
    private app: App;
    private appEntityType: string;

    static parameters = [Router, ActivatedRoute, AppService, PageTitleService];
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private appService: AppService,
        private pageTitleService: PageTitleService
    ) {
        this.appEntityType = config.entityTypes.APP.value;
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
}
