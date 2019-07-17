import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageTitleService } from 'components/page-title/page-title.service';
import { AuthService } from 'components/auth/auth.service';
import { ProvenanceGraphService } from 'components/provenance-graph/provenance-graph.service'

@Component({
    selector: 'app-main',
    template: require('./main.html'),
    styles: [require('./main.scss')]
})
export class MainComponent implements OnInit, OnDestroy {
    private isLoggedIn = false;
    private authInfoSub: Subscription;
    nodes: Object = {};

    static parameters = [PageTitleService, AuthService, ProvenanceGraphService];
    constructor(private pageTitleService: PageTitleService,
        private authService: AuthService,
        private provenanceGraphService: ProvenanceGraphService) {
        this.authInfoSub = this.authService.authInfo()
            .subscribe(authInfo => {
                this.isLoggedIn = authInfo.isLoggedIn();
            });

        this.nodes = this.provenanceGraphService.getNodesInNeoFormat()
    }

    ngOnInit() {
        this.pageTitleService.title = '';
    }

    ngOnDestroy() {
        this.authInfoSub.unsubscribe();
    }
}
