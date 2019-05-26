import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';

import { DiscussionService } from '../../../components/discussion/discussion.service';
import { Message } from '../../../../shared/interfaces/discussion/message.model';

@Component({
    selector: 'post-view',
    template: require('./post-view.html'),
    styles: [require('./post-view.scss')],
})
export class PostViewComponent {
    @Input() private post: Message;

    static parameters = [Router];
    constructor(private router: Router) { }
}
