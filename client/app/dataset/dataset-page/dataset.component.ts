import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DatasetService } from '../dataset.service';
import { DataCatalogService } from '../../data-catalog/data-catalog.service';
// import { Dataset } from '../../../../shared/interfaces/dataset.model';
import { CkanDataset } from '../../../../shared/interfaces/ckan/ckan-dataset.model';
import { DataCatalog } from '../../../../shared/interfaces/data-catalog.model';
import { PageTitleService } from '../../../components/page-title/page-title.service';
import { Observable, forkJoin, combineLatest, of, empty, never } from 'rxjs';
import { filter, map, switchMap, tap, concatMap, mergeMap, catchError } from 'rxjs/operators';

@Component({
    selector: 'dataset',
    template: require('./dataset.html'),
    styles: [require('./dataset.scss')],
})
export class DatasetComponent implements OnInit, OnDestroy {
    private dataset: CkanDataset;
    private catalog: DataCatalog;

    static parameters = [Router, ActivatedRoute, PageTitleService,
        DatasetService, DataCatalogService];
    constructor(private router: Router, private route: ActivatedRoute,
        private pageTitleService: PageTitleService,
        private datasetService: DatasetService,
        private catalogService: DataCatalogService) { }

    ngOnInit() {
        const dataCatalog = this.route.params.pipe(
            switchMap(res => this.catalogService.getDataCatalog(res.catalogId))
        );
        combineLatest(this.route.params, dataCatalog)
            .pipe(
                switchMap(([res, catalog]) => {
                    this.catalog = catalog;
                    return this.datasetService.getDataset(catalog, res.datasetId);
                })
            )
            .subscribe(dataset => {
                this.dataset = dataset;
                this.pageTitleService.title = dataset.title;
            });
    }

    ngOnDestroy() { }

    openCkan(dataset: CkanDataset): void {
        console.log('Not implemented.');
    }

    openFacileExplorer(dataset: CkanDataset): void {
        console.log('Not implemented');
    }
}
