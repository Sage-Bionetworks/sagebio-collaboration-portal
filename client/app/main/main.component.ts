import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageTitleService } from 'components/page-title/page-title.service';
import { AuthService } from 'components/auth/auth.service';
import { ProvenanceService } from 'components/provenance/provenance.service';

// import APP_CONFIG from './app.config';
import { Node } from 'components/d3/models/node';
import { Link } from 'components/d3/models/link';

@Component({
    selector: 'app-main',
    template: require('./main.html'),
    styles: [require('./main.scss')]
})
export class MainComponent implements OnInit, OnDestroy {
    private isLoggedIn = false;
    private authInfoSub: Subscription;
    private provenanceGraph: any;
    private provenanceAgentSubgraph: any;
    private provenanceRefSubgraphDown: any;
    private provenanceRefSubgraphUp: any;

    D3_DEMO_CONFIG = {
        N: 100,
        SPECTRUM: [
            // "rgb(222,237,250)"
            'rgb(176,212,243)',
            'rgb(128,186,236)',
            'rgb(77,158,228)',
            'rgb(38,137,223)',
            'rgb(0,116,217)',
            'rgb(0,106,197)'
            // 'rgb(0,94,176)'
            // 'rgb(0,82,154)'
            // 'rgb(0,60,113)'
        ]
    };

    nodes: Node[] = [];
    links: Link[] = [];

    static parameters = [PageTitleService, AuthService, ProvenanceService];
    constructor(private pageTitleService: PageTitleService,
        private authService: AuthService,
        private provenanceService: ProvenanceService) {
        this.authInfoSub = this.authService.authInfo()
            .subscribe(authInfo => {
                this.isLoggedIn = authInfo.isLoggedIn();
            });

        const N = this.D3_DEMO_CONFIG.N,
            getIndex = number => number - 1;

        /** constructing the nodes array */
        for (let i = 1; i <= N; i++) {
            this.nodes.push(new Node(i));
        }

        for (let i = 1; i <= N; i++) {
            for (let m = 2; i * m <= N; m++) {
                /** increasing connections toll on connecting nodes */
                this.nodes[getIndex(i)].linkCount++;
                this.nodes[getIndex(i * m)].linkCount++;

                /** connecting the nodes before starting the simulation */
                this.links.push(new Link(i, i * m));
            }
        }

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
