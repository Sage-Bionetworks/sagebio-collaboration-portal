import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DiscussionService } from '../discussion.service';
import { DiscoursePost } from '../../../../shared/interfaces/discourse/discourse-post.model';

@Component({
    selector: 'post-view',
    template: require('./post-view.html'),
    styles: [require('./post-view.scss')],
})
export class PostViewComponent {
    @Input() private post: DiscoursePost;

    static parameters = [Router];
    constructor(private router: Router) { }
}
