import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Thread } from 'models/messaging/thread.model';
import { MessagingService } from 'components/messaging/messaging.service';

@Component({
    selector: 'project-thread',
    template: require('./project-thread.html'),
    styles: [require('./project-thread.scss')],
})
export class ProjectThreadComponent {
    private thread$: Observable<Thread>; // used in html

    static parameters = [Router, ActivatedRoute, MessagingService];
    constructor(private router: Router, private route: ActivatedRoute, private messagingService: MessagingService) {
        this.thread$ = this.route.params.pipe(switchMap(res => this.messagingService.getThread(res.threadId)));
    }

    onThreadDeletion(thread: Thread): void {
        this.router.navigate(['..'], { relativeTo: this.route });
    }
}
