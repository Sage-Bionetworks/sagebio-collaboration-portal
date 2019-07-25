import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageTitleService } from 'components/page-title/page-title.service';
import { AuthService } from 'components/auth/auth.service';
import { ProvenanceService } from 'components/provenance/provenance.service';
import { ProvenanceNeoGraphService } from 'components/provenance-neo-graph/provenance-neo-graph.service';

@Component({
    selector: 'app-main',
    template: require('./main.html'),
    styles: [require('./main.scss')]
})
export class MainComponent implements OnInit, OnDestroy {
    private isLoggedIn = false;
    private authInfoSub: Subscription;
    private d3testGraph: any;
    // private neoTestGraph: any
    private provenanceGraph: any;
    private provenanceAgentSubgraph: any;
    private provenanceRefSubgraphDown: any;
    private provenanceRefSubgraphUp: any;

    static parameters = [PageTitleService, AuthService, ProvenanceService, ProvenanceNeoGraphService];
    constructor(private pageTitleService: PageTitleService,
        private authService: AuthService,
        private provenanceService: ProvenanceService,
        private provenanceNeoGraphService: ProvenanceNeoGraphService) {
        this.authInfoSub = this.authService.authInfo()
            .subscribe(authInfo => {
                this.isLoggedIn = authInfo.isLoggedIn();
            });

        this.d3testGraph = this.provenanceService.getMockedNodesAndRelationsForProvenanceGraph()
        // this.neoTestGraph = this.provenanceNeoGraphService.getSmallNodesInNeoFormat()
        this.provenanceService.getProvenanceGraph('created_at', 'desc', 1)
            .subscribe(graph => {
                this.provenanceGraph = graph;
            });
        this.provenanceService.getProvenanceGraphByAgent('UserID_1', 'created_at', 'desc', 1)
            .subscribe(graph => {
                this.provenanceAgentSubgraph = graph;
            });
        this.provenanceService.getProvenanceGraphByReference('TargetID_1', 'down', 'created_at', 'desc', 1)
            .subscribe(graph => {
                this.provenanceRefSubgraphDown = graph;
            });
        this.provenanceService.getProvenanceGraphByReference('TargetID_30', 'up', 'created_at', 'desc', 1)
            .subscribe(graph => {
                this.provenanceRefSubgraphUp = graph;
            });
    }

    ngOnInit() {
        this.pageTitleService.title = '';
    }

    ngOnDestroy() {
        this.authInfoSub.unsubscribe();
    }
}
