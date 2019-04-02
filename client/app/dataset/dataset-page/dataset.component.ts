import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DatasetService } from '../dataset.service';
import { Dataset } from '../../../../shared/interfaces/dataset.model';
import { PageTitleService } from '../../../components/page-title/page-title.service';

@Component({
    selector: 'dataset',
    template: require('./dataset.html'),
    styles: [require('./dataset.scss')],
})
export class DatasetComponent implements OnInit, OnDestroy {
    private dataset: Dataset;

    static parameters = [Router, ActivatedRoute, PageTitleService, DatasetService];
    constructor(private router: Router, private route: ActivatedRoute,
        private pageTitleService: PageTitleService, private datasetService: DatasetService) { }

    ngOnInit() {
        this.route.params.subscribe(res => {
            this.datasetService.getDataset(res.id).subscribe(dataset => {
                console.log('dataset', dataset);
                // // Get the instances of this dataset available to the user
                // this.AuthService.isLoggedIn().subscribe(is => {
                //   if (is) {
                //     this.InstanceService.queryBydataset(dataset)
                //       .subscribe(instances => {
                //         this.instances = instances;
                //         this.SocketService.syncUpdates('instance', this.instances);
                //       })
                //   }
                // });
                this.pageTitleService.title = dataset.name;
                this.dataset = dataset;
            });
        });
    }

    ngOnDestroy() { }

    openCkan(dataset: Dataset): void {
        console.log('Not implemented.');
    }

    openFacileExplorer(dataset: Dataset): void {
        console.log('Not implemented');
    }
}
