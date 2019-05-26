import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, ContentChildren, QueryList, forwardRef } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MessagingService } from '../../../components/messaging/messaging.service';
import { PageTitleService } from '../../../components/page-title/page-title.service';
import { Message } from '../../../../shared/interfaces/discussion/message.model';
import { Tag } from '../../../../shared/interfaces/discussion/tag.model';
import { TagService } from '../../../components/messaging/tag.service';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { orderBy } from 'lodash/fp';
import { discourse } from '../../app.constants';
import { QuillEditorComponent } from 'ngx-quill';
// import { MessageComponent } from '../../../components/discussion/message/message.component';

@Component({
    selector: 'post-list',
    template: require('./post-list.html'),
    styles: [require('./post-list.scss')],
})
export class PostListComponent implements OnInit, AfterViewInit {
    @ViewChild('editor') editor: QuillEditorComponent;
    private hide = false;
    private form: FormGroup;
    private posts: Observable<Message[]>;  // any[];

    private tags: Tag[] = [];

    static parameters = [Router, FormBuilder, PageTitleService, MessagingService,
        TagService];
    constructor(private router: Router, private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private messagingService: MessagingService,
        private tagService: TagService) {

        this.posts = this.messagingService.getMessages();
        // this.posts = this.discussionService.getLatestPosts();

        this.form = formBuilder.group({
            editor: ['test']
        });

        this.tagService.getTags()
            .subscribe(tags => this.tags = tags);
    }

    ngOnInit() {
        this.pageTitleService.title = 'Discussion';

        this.form
            .controls
            .editor
            .valueChanges.pipe(
                debounceTime(400),
                distinctUntilChanged()
            )
            .subscribe((data) => {
                console.log('native fromControl value changes with debounce', data);
            });
    }

    ngAfterViewInit() {
    }

    // getPostUrl(post: DiscoursePost): string {
    //     return `${discourse.website}/t/${post.topic_slug}/${post.topic_id}/${post.post_number}`;
    // }
    //
    // goToPost(post: DiscoursePost): void {
    //     window.open(this.getPostUrl(post), '_blank');
    // }
}
