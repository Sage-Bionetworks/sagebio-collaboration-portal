import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription, combineLatest } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { QuillEditorComponent } from 'ngx-quill';

import { NotificationService } from '../../../components/notification/notification.service';
import { SidenavService } from '../../sidenav/sidenav.service';
import { Message } from '../../../../shared/interfaces/discussion/message.model';
import { MessagingService } from '../messaging.service';
import { MessagingDataService } from '../messaging-data.service';
import { AppQuillEditorToolbarComponent } from '../../quill/app-quill-editor-toolbar/app-quill-editor-toolbar.component';
import { models } from '../../../app/app.constants';

@Component({
    selector: 'message-reply-button',
    template: require('./message-reply-button.html'),
    styles: [require('./message-reply-button.scss')]
})
export class MessageReplyButtonComponent implements OnInit {
    @Input() private message: Message;
    private numReplies = 0;
    // private starred = false;
    // private starredSub: Subscription;
    // private numStars = 0;
    // private tooltipPosition = 'above';

    static parameters = [MessagingService, MessagingDataService,
        NotificationService, SidenavService];
    constructor(private messagingService: MessagingService,
        private messagingDataService: MessagingDataService,
        private notificationService: NotificationService,
        private sidenavService: SidenavService) {
    }

    ngOnInit() {
        if (this.message) {
            this.messagingService.getNumReplies(this.message)
                .subscribe(numReplies => this.numReplies = numReplies,
                    err => {
                        console.log(err);
                    });
        }
    }

    ngOnDestroy() { }

    showReplies(): void {
        this.sidenavService.toggle();
        // this.notificationService.info('Not yet implemented');
    }
}
