import { Component, OnInit } from '@angular/core';
// import { Router, ActivatedRoute } from '@angular/router';
// import { AppService } from '../app.service';
// import { App } from 'models/entities/app.model';
// import { PageTitleService } from 'components/page-title/page-title.service';
// import config from '../../app/app.constants';

@Component({
    selector: 'discussion-new',
    template: require('./discussion-new.html'),
    styles: [require('./discussion-new.scss')],
})
export class DiscussionNewComponent implements OnInit {
    static parameters = [];
    constructor() {}

    ngOnInit() {}
}
