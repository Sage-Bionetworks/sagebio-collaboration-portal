import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageTitleService } from '../../components/page-title/page-title.service';
import { AuthService } from '../../components/auth/auth.service';

// import APP_CONFIG from './app.config';
import { Node, Link } from '../../components/d3/models';

@Component({
    selector: 'app-main',
    template: require('./main.html'),
    styles: [require('./main.scss')]
})
export class MainComponent implements OnInit, OnDestroy {
    private isLoggedIn = false;
    private authInfoSub: Subscription;

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

    static parameters = [PageTitleService, AuthService];
    constructor(private pageTitleService: PageTitleService,
        private authService: AuthService) {
        this.authInfoSub = this.authService.getAuthInfo()  // was authInfo()
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
    }

    ngOnInit() {
        this.pageTitleService.title = '';
    }

    ngOnDestroy() {
        this.authInfoSub.unsubscribe();
    }
}
