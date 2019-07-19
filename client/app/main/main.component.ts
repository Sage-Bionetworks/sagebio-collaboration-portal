import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageTitleService } from 'components/page-title/page-title.service';
import { AuthService } from 'components/auth/auth.service';
import { ProvenanceService } from 'components/provenance/provenance.service';

@Component({
    selector: 'app-main',
    template: require('./main.html'),
    styles: [require('./main.scss')]
})
export class MainComponent implements OnInit, OnDestroy {
    private isLoggedIn = false;
    private authInfoSub: Subscription;
    private testGraph: any;
    private provenanceGraph: any

    static parameters = [PageTitleService, AuthService, ProvenanceService];
    constructor(private pageTitleService: PageTitleService,
        private authService: AuthService,
        private provenanceService: ProvenanceService) {
        this.authInfoSub = this.authService.authInfo()
            .subscribe(authInfo => {
                this.isLoggedIn = authInfo.isLoggedIn();
            });

        this.testGraph = this.provenanceService.getMockedNodesAndRelationsForProvenanceGraph()
        console.log('this.testGraph: ', this.testGraph);

        this.provenanceService.getProvenanceGraph()
            .subscribe(graph => {
                this.provenanceGraph = graph;
            });
    }

    ngOnInit() {
        this.pageTitleService.title = '';
    }

    ngOnDestroy() {
        this.authInfoSub.unsubscribe();
    }
}
