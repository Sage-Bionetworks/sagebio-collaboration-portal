import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
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

    static parameters = [Router, ActivatedRoute, AppService];
    constructor(private router: Router, private route: ActivatedRoute, private appService: AppService) {
        this.appEntityType = config.entityTypes.APP.value;
    }

    ngOnInit() {
        this.app$ = this.appService.getApp();
    }

    onNewThread(thread: Thread): void {
        if (thread) {
            this.router.navigate(['..', thread._id], { relativeTo: this.route });
        }
    }

    onClose(): void {
        this.router.navigate(['..'], { relativeTo: this.route });
    }
}
