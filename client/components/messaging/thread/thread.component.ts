import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { App } from 'models/entities/app.model';
import { Thread } from 'models/messaging/thread.model';
// import { AppService } from './../../app.service';
// import config from '../../app.constants';
import { switchMap } from 'rxjs/operators';
import { NotificationService } from 'components/notification/notification.service';

@Component({
    selector: 'thread',
    template: require('./thread.html'),
    styles: [require('./thread.scss')],
})
export class ThreadComponent implements OnInit {
    private _thread: BehaviorSubject<Thread> = new BehaviorSubject<Thread>(null);

    // @Input() private thread$: Observable<Thread>;
    private showThreadEditTemplate = false;

    static parameters = [Router, ActivatedRoute, NotificationService];
    constructor(private router: Router, private route: ActivatedRoute, private notificationService: NotificationService) {

        // this.thread$ = this.route.params.pipe(
        //     switchMap(res => this.dataCatalogService.get(res.id))
        // );
    }

    get thread$(): Observable<Thread> {
        return this._thread.asObservable();
    }

    @Input()
    set thread(thread) {
        console.log('THEAD IS NOW', thread);
        this._thread.next(thread);
    }

    ngOnInit() {
        // this.app$ = this.appService.getApp();
    }

    getLink(): string {
        return window.location.href;
    }

    onThreadEdit(thread: Thread): void {
        if (thread) {
            this._thread.next(thread);
            this.showThreadEditTemplate = false;
        }
    }
}
