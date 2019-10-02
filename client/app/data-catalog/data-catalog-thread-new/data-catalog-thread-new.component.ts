import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Thread } from 'models/messaging/thread.model';
import config from '../../app.constants';

@Component({
    selector: 'data-catalog-thread-new',
    template: require('./data-catalog-thread-new.html'),
    styles: [require('./data-catalog-thread-new.scss')],
})
export class DataCatalogThreadNewComponent implements OnInit {
    private dataCatalogId$: Observable<string>; // used in html
    private entityType: string; // used in html

    static parameters = [Router, ActivatedRoute];
    constructor(private router: Router, private route: ActivatedRoute) {
        this.entityType = config.entityTypes.DATA_CATALOG.value;
    }

    ngOnInit() {
        this.dataCatalogId$ = this.route.params.pipe(map(res => res.id));
    }

    onNewThread(thread: Thread): void {
        if (thread) {
            this.router.navigate(['..', thread._id], { relativeTo: this.route });
        }
    }

    onClose(): void {
        this.router.navigate(['..'], { relativeTo: this.route });
    }
}
