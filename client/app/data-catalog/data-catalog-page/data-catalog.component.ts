import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DataCatalogService } from '../data-catalog.service';
import { DataCatalog } from '../../../../shared/interfaces/data-catalog.model';
import { PageTitleService } from '../../../components/page-title/page-title.service';

@Component({
    selector: 'data-catalog',
    template: require('./data-catalog.html'),
    styles: [require('./data-catalog.scss')],
})
export class DataCatalogComponent implements OnInit, OnDestroy {
    private dataCatalog: DataCatalog;

    static parameters = [Router, ActivatedRoute, PageTitleService, DataCatalogService];
    constructor(private router: Router, private route: ActivatedRoute,
        private pageTitleService: PageTitleService, private dataCatalogService: DataCatalogService) { }

    ngOnInit() {
        this.route.params.subscribe(res => {
            this.dataCatalogService.getDataCatalog(res.id).subscribe(dataCatalog => {
                // // Get the instances of this data-catalog available to the user
                // this.AuthService.isLoggedIn().subscribe(is => {
                //   if (is) {
                //     this.InstanceService.queryBydata-catalog(data-catalog)
                //       .subscribe(instances => {
                //         this.instances = instances;
                //         this.SocketService.syncUpdates('instance', this.instances);
                //       })
                //   }
                // });
                this.pageTitleService.title = dataCatalog.name;
                this.dataCatalog = dataCatalog;
            });
        });
    }

    ngOnDestroy() { }

    // openCkan(data-catalog: DataCatalog): void {
    //     console.log('Not implemented.');
    // }
    //
    // openFacileExplorer(data-catalog: DataCatalog): void {
    //     console.log('Not implemented');
    // }
}
