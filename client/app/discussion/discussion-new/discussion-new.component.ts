import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
// import { Router, ActivatedRoute } from '@angular/router';
// import { AppService } from '../app.service';
// import { App } from 'models/entities/app.model';
// import { PageTitleService } from 'components/page-title/page-title.service';
import { App } from 'models/entities/app.model';
import { Thread } from 'models/messaging/thread.model';
import { AppService } from './../../app.service';
import config from '../../app.constants';

@Component({
    selector: 'discussion-new',
    template: require('./discussion-new.html'),
    styles: [require('./discussion-new.scss')],
})
export class DiscussionNewComponent implements OnInit {
    private app$: Observable<App>;
    private appEntityType: string;

    static parameters = [Router, AppService];
    constructor(private router: Router, private appService: AppService) {
        this.appEntityType = config.entityTypes.APP.value;
    }

    ngOnInit() {
        this.app$ = this.appService.getApp();
    }

    onNewThread(thread: Thread): void {
        console.log('New thread has been created', thread);
    }

    onClose(): void {
        this.router.navigate(['/discussion']);
    }
}
