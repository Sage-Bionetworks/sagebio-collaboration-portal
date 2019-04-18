import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DatasetService } from '../dataset.service';
import { DataCatalogService } from '../../data-catalog/data-catalog.service';
import { ToolService } from '../../tool/tool.service';
import { Tool } from '../../../../shared/interfaces/tool.model';
import { CkanDataset } from '../../../../shared/interfaces/ckan/ckan-dataset.model';
import { CkanDatasetResource } from '../../../../shared/interfaces/ckan/ckan-dataset-resource.model';
import { DataCatalog } from '../../../../shared/interfaces/data-catalog.model';
import { PageTitleService } from '../../../components/page-title/page-title.service';
import { NotificationService } from '../../../components/notification/notification.service';
import { Observable, forkJoin, combineLatest, of, empty, never } from 'rxjs';
import { filter, map, switchMap, tap, concatMap, mergeMap, catchError } from 'rxjs/operators';
import { some, orderBy } from 'lodash/fp';

@Component({
    selector: 'dataset',
    template: require('./dataset.html'),
    styles: [require('./dataset.scss')],
})
export class DatasetComponent implements OnInit, OnDestroy {
    private dataset: CkanDataset;
    private catalog: DataCatalog;
    private tools: Tool[];
    private resources: CkanDatasetResource[];

    static parameters = [Router, ActivatedRoute, PageTitleService,
        DatasetService, DataCatalogService, ToolService, NotificationService];
    constructor(private router: Router, private route: ActivatedRoute,
        private pageTitleService: PageTitleService,
        private datasetService: DatasetService,
        private catalogService: DataCatalogService,
        private toolService: ToolService,
        private notificationService: NotificationService) { }

    ngOnInit() {
        const dataCatalog = this.route.params.pipe(
            switchMap(res => this.catalogService.getDataCatalog(res.catalogId))
        );
        combineLatest(
            this.route.params,
            dataCatalog,
            this.toolService.getTools()
        )
            .pipe(
                switchMap(([res, catalog, tools]) => {
                    this.catalog = catalog;
                    this.tools = orderBy('name', 'asc', tools);
                    return this.datasetService.getDataset(catalog, res.datasetId);
                })
            )
            .subscribe(dataset => {
                this.resources = dataset.resources;
                this.dataset = dataset;
                this.pageTitleService.title = dataset.title;
            });
    }

    ngOnDestroy() { }

    // TODO: Remove, insteade generate list of compatible tool for each resrouce in ngOnInit()
    getToolsByResource(resource: CkanDatasetResource): Tool[] {
        var x = this.tools.filter(tool => tool.resourceFormats.includes(resource.format));
        return x;
    }

    getToolsByDataset(dataset: CkanDataset): Tool[] {
        if (this.catalog._id === '5cb6a048e7bdc7740874fd91' &&  // Roche Data Portal
            dataset.id === 'b9096985-1ae9-43f8-8276-3bf194c4ce59') {  // search "IMvigor Bladder 211"
            // http://dev.phc.sagesandbox.org/datasets/5cb6a048e7bdc7740874fd91/b9096985-1ae9-43f8-8276-3bf194c4ce59
            return this.tools.filter(tool => ['Facile Explorer'].includes(tool.name));
        } else if (this.catalog._id === '5cb6a048e7bdc7740874f356' &&  // Kumar's CKAN
            dataset.id === '6622834c-0bb8-43df-ab1d-203b0a7bc8fb') {  // IRIS Image Analysis Dataset
            // http://dev.phc.sagesandbox.org/datasets/5cb6a048e7bdc7740874f356/6622834c-0bb8-43df-ab1d-203b0a7bc8fb
            return this.tools.filter(tool => ['IRIS Enterprise Explorer'].includes(tool.name));
        } else if (this.catalog._id === '5cb6a048e7bdc7740874f356' &&  // Kumar's CKAN
            dataset.id === '011e7b1a-87a3-459d-baa9-49a689d261e7') {  // Picnic Health Data
            // http://dev.phc.sagesandbox.org/datasets/5cb6a048e7bdc7740874f356/011e7b1a-87a3-459d-baa9-49a689d261e7
            return this.tools.filter(tool => ['RStudio', 'Jupyter'].includes(tool.name));
        }
    }

    openResourceWithTool(resource: CkanDatasetResource, tool: Tool): void {
        window.open(tool.website, '_blank');
    }

    openDatasetWithTool(dataset: CkanDataset, tool: Tool): void {
        if (this.catalog._id === '5cb6a048e7bdc7740874fd91' &&  // Roche Data Portal
            dataset.id === 'b9096985-1ae9-43f8-8276-3bf194c4ce59') {  // search "IMvigor Bladder 211"
            // http://dev.phc.sagesandbox.org/datasets/5cb6a048e7bdc7740874fd91/b9096985-1ae9-43f8-8276-3bf194c4ce59
            window.open('http://gred-shiny-p01.sc1.roche.com:3838/facileexplorer/?activeFDS=FacileAtezoDataSet%20v0.7.8', '_blank');
        } else if (this.catalog._id === '5cb6a048e7bdc7740874f356' &&  // Kumar's CKAN
            dataset.id === '6622834c-0bb8-43df-ab1d-203b0a7bc8fb') {  // IRIS Image Analysis Dataset
            // http://dev.phc.sagesandbox.org/datasets/5cb6a048e7bdc7740874f356/6622834c-0bb8-43df-ab1d-203b0a7bc8fb
            window.open('https://iris-stage.navify.com/studies', '_blank');
        } else if (this.catalog._id === '5cb6a048e7bdc7740874f356' &&  // Kumar's CKAN
            dataset.id === '011e7b1a-87a3-459d-baa9-49a689d261e7') {  // Picnic Health Data
            // http://dev.phc.sagesandbox.org/datasets/5cb6a048e7bdc7740874f356/011e7b1a-87a3-459d-baa9-49a689d261e7
            if (tool.name === 'RStudio') {
                window.open('https://ksuruli-744024.rs.phcaa.science.roche.com/auth-sign-in', '_blank');
            } else if (tool.name === 'Jupyter') {
                window.open('https://ksuruli-6c8242.jh.phcaa.science.roche.com/', '_blank');
            }
        }
    }
}
