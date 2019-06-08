import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, ContentChildren, QueryList, forwardRef, Input } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MessagingService } from '../../../components/messaging/messaging.service';
import { SocketService } from '../../../components/socket/socket.service';
// import { PageTitleService } from '../../../components/page-title/page-title.service';
import { Message } from '../../../../shared/interfaces/discussion/message.model';
import { Tag } from '../../../../shared/interfaces/tag.model';
// import { TagService } from '../../../components/tag/tag.service';
// import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
// import { orderBy } from 'lodash/fp';
// import moment from 'moment';
import { DateAndTimePipe } from '../../pipes/date/date-and-time.pipe';
import { DateLongPipe } from '../../pipes/date/date-long.pipe';
import { SameDayPipe } from '../../pipes/date/same-day.pipe';

@Component({
    selector: 'messaging-view',
    template: require('./messaging-view.html'),
    styles: [require('./messaging-view.scss')],
})
export class MessagingViewComponent implements OnInit, AfterViewInit {
    private _tags: Tag[] = [];
    private messages: Message[];

    static parameters = [Router,
        MessagingService, SocketService];
    constructor(private router: Router,
        private messagingService: MessagingService,
        private socketService: SocketService) {

        // this.messagingService.getMessages()
        //     .subscribe(messages => {
        //         this.posts = messages;
        //         this.socketService.syncUpdates('message', this.posts);
        //     });

        // this.tagService.getTags()
        //     .subscribe(tags => this.tags = tags);
    }

    ngOnInit() { }

    ngAfterViewInit() {
    }

    get tags() {
        return this._tags;
    }

    @Input()
    set tags(tags: Tag[]) {
        this._tags = tags;

        this.messagingService.getMessages()
            .subscribe(messages => {
                this.messages = messages;
                this.socketService.syncUpdates('message', this.messages);
            });
    }

    // getPostUrl(post: DiscoursePost): string {
    //     return `${discourse.website}/t/${post.topic_slug}/${post.topic_id}/${post.post_number}`;
    // }
    //
    // goToPost(post: DiscoursePost): void {
    //     window.open(this.getPostUrl(post), '_blank');
    // }

    // getDateString(isoDateString: string): string {
    //   let date = new Date(isoDateString);
    //   let currentYear = new Date().getFullYear() === date.getFullYear();
    //   let format = currentYear ? 'dddd, MMMM Do' : 'dddd, MMMM Do, YYYY';
    //   return moment(date).format(format);
    // }
}
