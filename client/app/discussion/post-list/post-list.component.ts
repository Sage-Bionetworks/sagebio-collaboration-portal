import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, ContentChildren, QueryList, forwardRef } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DiscussionService } from '../discussion.service';
import { DiscourseCategory } from '../../../../shared/interfaces/discourse/discourse-category.model';
import { DiscourseTopic } from '../../../../shared/interfaces/discourse/discourse-topic.model';
import { DiscoursePost } from '../../../../shared/interfaces/discourse/discourse-post.model';
import { PageTitleService } from '../../../components/page-title/page-title.service';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { orderBy } from 'lodash/fp';

@Component({
    selector: 'post-list',
    template: require('./post-list.html'),
    styles: [require('./post-list.scss')],
})
export class PostListComponent implements OnInit, AfterViewInit {
    private posts: Observable<DiscoursePost[]>;

    static parameters = [Router, FormBuilder, PageTitleService, DiscussionService];
    constructor(private router: Router, private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private discussionService: DiscussionService) {
        this.posts = this.discussionService.getLatestPosts();
            // .pipe(
            //     map(posts => orderBy('name', 'asc', posts))
            // );
    }

    ngOnInit() {
        this.pageTitleService.title = 'Discussion';
    }

    ngAfterViewInit() {
    }
}
