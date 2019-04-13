import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, ContentChildren, QueryList, forwardRef } from '@angular/core';
import { Observable, forkJoin, combineLatest, of } from 'rxjs';
import { map, switchMap, tap, concatMap, mergeMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DatasetService } from '../dataset.service';
import { CkanDataset } from '../../../../shared/interfaces/ckan/ckan-dataset.model';
import { PageTitleService } from '../../../components/page-title/page-title.service';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
// import { DatasetSearchComponent } from '../dataset-search/dataset-search.component';
// import constants from '../../../app/app.constants';
// import { values } from 'lodash/fp';
// import { Filter } from '../../../components/filters/filter';
// import { FiltersComponent } from '../../../components/filters/filters.component';
// import { ActiveFilter } from '../../../components/filters/active-filter';
// import { flow, keyBy, mapValues } from 'lodash/fp';
// import { DatasetCatalogFiltersComponent } from './dataset-catalog-filters/dataset-catalog-filters.component';
// import { DatasetCatalogFilterComponent } from './dataset-catalog-filter/dataset-catalog-filter.component';
// import { DatasetSearchFilterComponent } from './dataset-search-filter/dataset-catalog-filter.component';
import { DataCatalog } from '../../../../shared/interfaces/data-catalog.model';
import { DataCatalogService } from '../../data-catalog/data-catalog.service';

import { Filter } from '../../../components/filters/filter.model';
import { FiltersComponent } from '../../../components/filters/filters.component';
import { flow, keyBy, mapValues, values, find } from 'lodash/fp';
import { datasetOrders } from '../../app.constants';

@Component({
    selector: 'dataset-list',
    template: require('./dataset-list.html'),
    styles: [require('./dataset-list.scss')],
})
export class DatasetListComponent implements OnInit, AfterViewInit {
    private datasets: Observable<CkanDataset[]>;
    private catalogs: DataCatalog[] = [];

    private catalogFilters: Filter[] = [];
    private orderFilters: Filter[] = [];

    @ViewChildren(FiltersComponent) filters: QueryList<FiltersComponent>;

    static parameters = [Router, FormBuilder, PageTitleService, DatasetService,
        DataCatalogService];
    constructor(private router: Router, private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private datasetService: DatasetService, private catalogService: DataCatalogService) {

        this.orderFilters = values(datasetOrders);
        // catalogService.getDataCatalogs()
        //     .subscribe(catalogs => {
        //         this.catalogs = catalogs;
        //         this.catalogFilters = catalogs.map((c, i) => ({
        //             value: c._id,
        //             title: c.name,
        //             active: i === 0
        //         }));
        //         console.log('CATALOG SUBSCRIBE DONE');
        //     });

        console.log('CONSTRUCTOR DONE');

        // catalogService.getDataCatalogs()
        //     .pipe(
        //         concatMap(catalogs => {
        //             return forkJoin(
        //                 of(catalogs),
        //                 datasetService.getDatasets(catalogs)
        //             );
        //         })
        //     )
        //     .subscribe(([catalogs, datasets]) => {
        //         this.catalogs = catalogs;
        //         this.catalogFilters = catalogs.map((c, i) => ({
        //             value: c._id,
        //             title: c.name,
        //             active: i === 0
        //         }));
        //
        //         console.log('SUBSCRIBE');
        //         // this.datasets = datasets;
        //         // console.log('datasets', datasets);
        //         // datasetService.getAllDatasetsByCatalog(catalogs[1])
        //         //     .subscribe(d => console.log('NUM DATASETS', datasets.length));
        //     });


        // this.catalogs = values(constants.gameTags);
    }

    ngOnInit() {
        this.pageTitleService.title = 'Datasets';
    }

    ngAfterViewInit() {
        // const filters = this.filters.map(filter => filter.getSelectedFilter());

        this.datasets = this.catalogService.getDataCatalogs()
            .pipe(
                map(catalogs => {
                    this.catalogs = catalogs;
                    this.catalogFilters = catalogs.map((c, i) => ({
                        value: c._id,
                        title: c.name,
                        active: i === 0
                    }));
                    console.log('filter internal', this.catalogFilters);
                    let plop = this.filters.map(filter => {
                        console.log('filter value', filter);
                        return filter.getSelectedFilter();
                    });
                    console.log('plop', plop);
                    return plop;
                }),
                mergeMap(f => {
                    console.log('combineLatest');
                    return combineLatest(...f)
                        .pipe(
                            map(myFilters =>
                                flow([
                                    keyBy('group'),
                                    mapValues('value')
                                ])(myFilters)
                            ),
                            tap(query => console.log('QUERY', query))
                        );
                }),
                switchMap(() => ([])),
                tap(query => console.log('query', query))
            );
        // console.log('filters', filters);

        // combineLatest(...filters);


        // this.datasets = combineLatest(...filters)
        //     .pipe(
        //         map(myFilters =>
        //             flow([
        //                 keyBy('group'),
        //                 mapValues('value')
        //             ])(myFilters)
        //         ),
        //         tap(query => console.log('QUERY', query)),
        //         switchMap(query => {
        //             console.log('catalogs', this.catalogs);
        //             let catalog = find({ '_id': query.catalog }, this.catalogs);
        //             console.log('Selected catalog', catalog);
        //             return [];
        //             // return catalog ? this.datasetService.getDatasetsByCatalog(catalog) : [];
        //             // return this.datasetService.getDatasetsByCatalog(catalog);                    // return [];
        //         })
        //     );

        // const filters = this.filters.map(filter => filter.getSelectedFilter());
        //
        // const filters = this.catalogService.getDataCatalogs()
        //     .pipe(
        //         map(catalogs => {
        //             this.catalogs = catalogs;
        //             this.catalogFilters = catalogs.map((c, i) => ({
        //                 value: c._id,
        //                 title: c.name,
        //                 active: i === 0
        //             }));
        //             return this.filters.map(filter => filter.getSelectedFilter());
        //         })
        //     );
        //
        //     this.datasets = combineLatest(...filters)
        //         .pipe(
        //             map(myFilters =>
        //                 flow([
        //                     keyBy('group'),
        //                     mapValues('value')
        //                 ])(myFilters)
        //             ),
        //             tap(query => console.log('QUERY', query)),
        //             switchMap(query => {
        //                 console.log('catalogs', this.catalogs);
        //                 let catalog = find({ '_id': query.catalog }, this.catalogs);
        //                 console.log('Selected catalog', catalog);
        //                 return [];
        //                 // return catalog ? this.datasetService.getDatasetsByCatalog(catalog) : [];
        //                 // return this.datasetService.getDatasetsByCatalog(catalog);                    // return [];
        //             })
        //         );




        // this.catalogService.getDataCatalogs(),
        //     combineLatest(...filters)
        //         .pipe(
        //             map(myFilters =>
        //                 flow([
        //                     keyBy('group'),
        //                     mapValues('value')
        //                 ])(myFilters)
        //             ),
        //             tap(query => console.log('QUERY', query)),
        //     ))
        //     .pipe(
        //     switchMap(res => {
        //         let catalogs = res[0];
        //         let query = res[1];
        //         console.log('catalogs', catalogs);
        //         console.log('query', query);
        //         return [];
        //     })
        // );

        // this.datasets = combineLatest(
        //     this.catalogService.getDataCatalogs(),
        //     combineLatest(...filters)
        //         .pipe(
        //             map(myFilters =>
        //                 flow([
        //                     keyBy('group'),
        //                     mapValues('value')
        //                 ])(myFilters)
        //             ),
        //             tap(query => console.log('QUERY', query)),
        //     ))
        //     .pipe(
        //         switchMap(res => {
        //             let catalogs = res[0];
        //             let query = res[1];
        //             console.log('catalogs', catalogs);
        //             console.log('query', query);
        //             return [];
        //         })
        //     );
    }
}
