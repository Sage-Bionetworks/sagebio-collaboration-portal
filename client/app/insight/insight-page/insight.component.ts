import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { InsightService } from '../insight.service';
import { Insight } from '../../../../shared/interfaces/insight.model';
import { PageTitleService } from '../../../components/page-title/page-title.service';

@Component({
    selector: 'insight',
    template: require('./insight.html'),
    styles: [require('./insight.scss')],
})
export class InsightComponent implements OnInit, OnDestroy {
    private insight: Insight;

    static parameters = [Router, ActivatedRoute, PageTitleService, InsightService];
    constructor(private router: Router, private route: ActivatedRoute,
        private pageTitleService: PageTitleService, private insightService: InsightService) { }

    ngOnInit() {
        this.route.params.subscribe(res => {
            this.insightService.getInsight(res.id).subscribe(insight => {
                // // Get the instances of this insight available to the user
                // this.AuthService.isLoggedIn().subscribe(is => {
                //   if (is) {
                //     this.InstanceService.queryByinsight(insight)
                //       .subscribe(instances => {
                //         this.instances = instances;
                //         this.SocketService.syncUpdates('instance', this.instances);
                //       })
                //   }
                // });
                this.pageTitleService.title = insight.name;
                this.insight = insight;
            });
        });
    }

    ngOnDestroy() { }

    // openCkan(insight: Insight): void {
    //     console.log('Not implemented.');
    // }
    //
    // openFacileExplorer(insight: Insight): void {
    //     console.log('Not implemented');
    // }
}
