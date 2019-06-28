import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageTitleService } from '../../components/page-title/page-title.service';
import { AuthService } from '../../components/auth/auth.service';

@Component({
    selector: 'app-main',
    template: require('./main.html'),
    styles: [require('./main.scss')]
})
export class MainComponent implements OnInit, OnDestroy {
    private isLoggedIn = false;
    private authInfoSub: Subscription;

    static parameters = [PageTitleService, AuthService];
    constructor(private pageTitleService: PageTitleService,
        private authService: AuthService) {
        this.authInfoSub = this.authService.getAuthInfo()  // was authInfo()
            .subscribe(authInfo => {
                this.isLoggedIn = authInfo.isLoggedIn();
            });
    }

    ngOnInit() {
        this.pageTitleService.title = '';
    }

    ngOnDestroy() {
        this.authInfoSub.unsubscribe();
    }
}
