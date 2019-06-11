import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription, combineLatest } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { QuillEditorComponent } from 'ngx-quill';
import { NotificationService } from '../../../components/notification/notification.service';
import { Message } from '../../../../shared/interfaces/messaging/message.model';
import { MessagingService } from '../messaging.service';
import { MessagingDataService } from '../messaging-data.service';
import { AppQuillEditorToolbarComponent } from '../../quill/app-quill-editor-toolbar/app-quill-editor-toolbar.component';
// import { models } from '../../../app/app.constants';

@Component({
    selector: 'message-star-archive-button',
    template: require('./message-star-archive-button.html'),
    styles: [require('./message-star-archive-button.scss')]
})
export class MessageStarArchiveButtonComponent implements OnInit {
    @Input() private message: Message;
    private archived = false;
    // private starred = false;
    // private starredSub: Subscription;
    // private numStars = 0;
    // private tooltipPosition = 'above';

    static parameters = [MessagingService, MessagingDataService,
        NotificationService];
    constructor(private messagingService: MessagingService,
        private messagingDataService: MessagingDataService,
        private notificationService: NotificationService) {
    }

    ngOnInit() {
        if (this.message) {
            this.messagingDataService.getStarredMessages()
                .pipe(
                    map(stars => stars.find(star => star.message === this.message._id)),
                    map(star => star ? star.archived : false)
                )
                .subscribe(archived => {
                    console.log('archived', archived);
                    this.archived = archived;
                },
                    err => {
                        console.log(err);
                    });
        }
    }

    ngOnDestroy() { }

    archive(): void {
        this.messagingService.archiveStar(this.message)
            .subscribe(star => {
                console.log('star returned', star);
            },
                err => {
                    console.log(err);
                    this.notificationService.error('Unable to archive message star');
                });
    }

    unarchive(): void {
        this.messagingService.unarchiveStar(this.message)
            .subscribe(star => {
                console.log('star returned', star);
            },
                err => {
                    console.log(err);
                    this.notificationService.error('Unable to unarchive message star');
                });
    }

    // toggleArchiveStatus(): void {
    //     // this.notificationService.info('Not yet implemented');
    // }
}
