import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { App } from 'models/entities/app.model';
import { Thread } from 'models/messaging/thread.model';
import { AppService } from './../../app.service';
import config from '../../app.constants';
import { switchMap } from 'rxjs/operators';
import { MessagingService } from 'components/messaging/messaging.service';

@Component({
    selector: 'app-thread',
    template: require('./app-thread.html'),
    styles: [require('./app-thread.scss')],
})
export class AppThreadComponent implements OnInit {
    private thread$: Observable<Thread>;

    static parameters = [Router, ActivatedRoute, MessagingService];
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private messagingService: MessagingService
    ) {
        this.thread$ = this.route.params.pipe(switchMap(res => this.messagingService.getThread(res.id)));
    }

    ngOnInit() {
        // this.app$ = this.appService.getApp();
    }
}
