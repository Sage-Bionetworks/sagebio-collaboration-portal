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
    private posts: any[];

    static parameters = [Router, FormBuilder, PageTitleService, DiscussionService];
    constructor(private router: Router, private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private discussionService: DiscussionService) {
        // this.posts = this.discussionService.getLatestPosts();
        // .pipe(
        //     map(posts => orderBy('name', 'asc', posts))
        // );
        this.posts = [{
            topic_title: 'Tips for interpreting heatmaps in Facile Explorer',
            name: 'Yooree'
        }, {
            topic_title: 'How were the expression values in the FacileAtezoDatasetv0.7.8 normalized?',
            name: 'Kumar'
        }, {
            topic_title: 'Has anyone done a STAR alignment on the NSCLC RNAseq datasets? If so, are the STAR alignment log files available?',
            name: 'Alpna'
        }, {
            topic_title: 'Statistician looking for help from a clinician to make sense of IMvigor Bladder Cancer image sets in IRISe!',
            name: 'Tom'
        }, {
            topic_title: 'How to reproduce the PCA on TCGA breast cancer dataset?',
            name: 'Kim'
        }, {
            topic_title: 'Diff express cancer indication breast/NSCLC',
            name: 'James'
        }, {
            topic_title: 'Welcome to PHC-IX Collaboration Portal',
            name: 'Thomas'
        }];
    }

    ngOnInit() {
        this.pageTitleService.title = 'Discussion';
    }

    ngAfterViewInit() {
    }
}
