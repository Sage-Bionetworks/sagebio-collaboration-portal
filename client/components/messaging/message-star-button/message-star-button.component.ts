import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, BehaviorSubject, Subscription, combineLatest } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { QuillEditorComponent } from 'ngx-quill';
import { NotificationService } from '../../../components/notification/notification.service';
import { Message } from '../../../../shared/interfaces/discussion/message.model';
import { MessagingService } from '../messaging.service';
import { MessagingDataService } from '../messaging-data.service';
import { AppQuillEditorToolbarComponent } from '../../quill/app-quill-editor-toolbar/app-quill-editor-toolbar.component';

@Component({
    selector: 'message-star-button',
    template: require('./message-star-button.html'),
    styles: [require('./message-star-button.scss')]
})
export class MessageStarButtonComponent implements OnInit {
    @Input() private message: Message;
    private starred: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private starredSub: Subscription;
    private numStars = 0;
    private tooltipPosition = 'above';

    static parameters = [MessagingService, MessagingDataService,
        NotificationService];
    constructor(private messagingService: MessagingService,
        private messagingDataService: MessagingDataService,
        private notificationService: NotificationService) {
    }

    ngOnInit() {
        this.starredSub = this.messagingDataService.getStarredMessages()
            .pipe(
                map(stars => stars.map(star => star.message).includes(this.message._id))
            )
            .subscribe(starred => {
                this.starred.next(starred);
                this.messagingService.getNumStars(this.message)
                    .subscribe(numStars => this.numStars = numStars);
            });
    }

    ngOnDestroy() {
        if (this.starredSub) this.starredSub.unsubscribe();
    }

    starMessage(): void {
        this.messagingService.starMessage(this.message)
            .subscribe(() => { },
                err => {
                    console.log(err);
                    this.notificationService.error('Unable to star message');
                });
    }

    unstarMessage(): void {
        this.messagingService.unstarMessage(this.message)
            .subscribe(() => { },
                err => {
                    console.log(err);
                    this.notificationService.error('Unable to unstar message');
                });
    }

    /**
     * Returns wether the message is starred by the user.
     * @return {Observable<boolean>}
     */
    isStarred(): Observable<boolean> {
        return this.starred.asObservable();
    }
}
