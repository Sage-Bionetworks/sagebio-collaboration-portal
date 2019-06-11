import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, ContentChildren, QueryList, forwardRef } from '@angular/core';
// import { Observable, combineLatest } from 'rxjs';
// import { map, switchMap, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
// import { Router } from '@angular/router';
// import { MessagingService } from '../../../components/messaging/messaging.service';
import { PageTitleService } from '../../../components/page-title/page-title.service';
import { Tag } from '../../../../shared/interfaces/tag.model';
import { TagService } from '../../../components/tag/tag.service';
// import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
// import { orderBy } from 'lodash/fp';
// import { SocketService } from '../../../components/socket/socket.service';


@Component({
    selector: 'post-list',
    template: require('./post-list.html'),
    styles: [require('./post-list.scss')],
})
export class PostListComponent implements OnInit, AfterViewInit {
    private tags: Tag[] = [];

    static parameters = [PageTitleService, TagService];
    constructor(private pageTitleService: PageTitleService,
        private tagService: TagService) {
        this.tagService.getTags()
            .subscribe(tags => this.tags = tags);
    }

    ngOnInit() {
        this.pageTitleService.title = 'Discussion';
    }

    ngAfterViewInit() {
    }
}
