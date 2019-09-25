import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { App } from 'models/entities/app.model';
import { Thread } from 'models/messaging/thread.model';
// import { AppService } from './../../app.service';
// import config from '../../app.constants';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'thread',
    template: require('./thread.html'),
    styles: [require('./thread.scss')],
})
export class ThreadComponent implements OnInit {
    @Input() private thread$: Observable<Thread>;
    private showThreadEditTemplate = false;

    static parameters = [Router, ActivatedRoute];
    constructor(private router: Router, private route: ActivatedRoute) {

        // this.thread$ = this.route.params.pipe(
        //     switchMap(res => this.dataCatalogService.get(res.id))
        // );
    }

    ngOnInit() {
        // this.app$ = this.appService.getApp();
    }
}
