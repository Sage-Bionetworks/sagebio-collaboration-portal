import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap, catchError } from 'rxjs/operators';
import { DataCatalogService } from '../data-catalog.service';
import { DataCatalog } from 'models/entities/data-catalog.model';
import { PageTitleService } from 'components/page-title/page-title.service';
import config from '../../../app/app.constants';

@Component({
    selector: 'data-catalog-discussion',
    template: require('./data-catalog-discussion.html'),
    styles: [require('./data-catalog-discussion.scss')],
})
export class DataCatalogDiscussionComponent implements OnInit {
    private catalog: DataCatalog;
    private entityType: string;

    static parameters = [Router, ActivatedRoute, DataCatalogService, PageTitleService];
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private dataCatalogService: DataCatalogService,
        private pageTitleService: PageTitleService
    ) {
        this.entityType = config.entityTypes.TOOL.value;
    }

    ngOnInit() {
        const getCatalog = this.route.params.pipe(switchMap(res => this.dataCatalogService.getDataCatalogBySlug(res.slug)));

        getCatalog.subscribe(
            catalog => {
                this.catalog = catalog;
                this.pageTitleService.title = `${catalog.title} - Discussion`;
            },
            err => console.error(err)
        );
    }
}
