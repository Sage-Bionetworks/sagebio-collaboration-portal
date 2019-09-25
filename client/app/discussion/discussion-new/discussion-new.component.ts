import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
// import { Router, ActivatedRoute } from '@angular/router';
// import { AppService } from '../app.service';
// import { App } from 'models/entities/app.model';
// import { PageTitleService } from 'components/page-title/page-title.service';
// import config from '../../app/app.constants';
import { App } from 'models/entities/app.model';
import { AppService } from './../../app.service';

@Component({
    selector: 'discussion-new',
    template: require('./discussion-new.html'),
    styles: [require('./discussion-new.scss')],
})
export class DiscussionNewComponent implements OnInit {
    private app$: Observable<App>;

    static parameters = [Router, AppService];
    constructor(private router: Router, private appService: AppService) {}

    ngOnInit() {
        this.app$ = this.appService.getApp();
    }

    onClose(): void {
        this.router.navigate(['/discussion']);
    }
}
