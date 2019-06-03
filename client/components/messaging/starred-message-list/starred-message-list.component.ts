import { Component, OnInit } from '@angular/core';

import { Message } from '../../../../shared/interfaces/discussion/message.model';
import { StarredMessage } from '../../../../shared/interfaces/discussion/starred-message.model';
import { MessagingDataService } from '../messaging-data.service';

// import { Observable, combineLatest } from 'rxjs';
// import { map, switchMap, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
// import { Router } from '@angular/router';
// import { MessagingService } from '../../../components/messaging/messaging.service';
// import { SocketService } from '../../../components/socket/socket.service';
// import { PageTitleService } from '../../../components/page-title/page-title.service';
// import { Message } from '../../../../shared/interfaces/discussion/message.model';
// import { Tag } from '../../../../shared/interfaces/tag.model';
// import { TagService } from '../../../components/tag/tag.service';
// import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
// import { orderBy } from 'lodash/fp';

// TODO: Sort message by createdAt

@Component({
    selector: 'starred-message-list',
    template: require('./starred-message-list.html'),
    styles: [require('./starred-message-list.scss')],
})
export class StarredMessageListComponent implements OnInit {
    private stars: StarredMessage[] = [];
    private archivedStars: StarredMessage[] = [];

    static parameters = [MessagingDataService];
    constructor(private messagingDataService: MessagingDataService) {
        this.messagingDataService.getStarredMessages()
            .subscribe(messages => {
                this.stars = messages.filter(message => !message.archived);
                this.archivedStars = messages.filter(message => message.archived);
            });
    }

    ngOnInit() { }
}
