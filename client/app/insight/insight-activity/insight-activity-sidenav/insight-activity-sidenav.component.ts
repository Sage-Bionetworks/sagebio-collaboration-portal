import { Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { orderBy } from 'lodash/fp';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';
import { SocketService } from 'components/socket/socket.service';
import { ProvenanceService } from 'components/provenance/provenance.service';
import { Insight } from 'models/insights/insight.model';

@Component({
    selector: 'insight-activity-sidenav',
    template: require('./insight-activity-sidenav.html'),
    styles: [require('./insight-activity-sidenav.scss')]
})
export class ActivitySidenavComponent implements OnDestroy {
    private insight: Insight;
    // private activity: BehaviorSubject<Insight> = new BehaviorSubject<Insight>();
    private provenanceGraph: any;

    static parameters = [SecondarySidenavService, ProvenanceService, SocketService];
    constructor(private sidenavService: SecondarySidenavService,
        private provenanceService: ProvenanceService,
        private socketService: SocketService) {
            // this.activity = this.provenanceService.getProvenanceGraph('created_at', 'desc', 1)
            //     .subscribe(graph => {
            //         this.provenanceGraph = graph;
            //     });
        }

    ngOnDestroy() {
        this.socketService.unsyncUpdates(`activity:${this.insight._id}:insight`);
    }

    setInsight(insight: Insight): void {
        if (insight) {
            this.provenanceService.getProvenanceGraph('created_at', 'desc', 1)
                .subscribe(activity => {
                    // this.socketService.syncItemSubject(`activity:${insight._id}:insight`, this.activity);
                    this.provenanceGraph = activity;
                });
        }
    }

    close(): void {
        this.sidenavService.close();
        this.sidenavService.destroyContentComponent();
    }
}
