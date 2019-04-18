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
        return this.tools.filter(tool => ['TCGA Shiny'].includes(tool.name));  // FOR_DEMO_APR18
    }

    openResourceWithTool(resource: CkanDatasetResource, tool: Tool): void {
        window.open(tool.website, '_blank');
    }

    openDatasetWithTool(dataset: CkanDataset, tool: Tool): void {
        if (dataset.id === 'b9096985-1ae9-43f8-8276-3bf194c4ce59') {  // FOR_DEMO_APR18
          window.open('http://gred-shiny-p01.sc1.roche.com:3838/facileexplorer/?activeFDS=FacileAtezoDataSet%20v0.7.8', '_blank');
        } else {
          window.open(tool.website, '_blank');
        }
    }
}
