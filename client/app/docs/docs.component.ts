import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageTitleService } from 'components/page-title/page-title.service';
import { AuthService } from 'components/auth/auth.service';

@Component({
    selector: 'app-docs',
    template: require('./docs.html'),
    styles: [require('./docs.scss')]
})
export class DocsComponent implements OnInit, OnDestroy {
    private isLoggedIn = false;
    private authInfoSub: Subscription;

    static parameters = [PageTitleService, AuthService];
    constructor(private pageTitleService: PageTitleService,
        private authService: AuthService) {
        this.authInfoSub = this.authService.authInfo()
            .subscribe(authInfo => {
                this.isLoggedIn = authInfo.isLoggedIn();
            });
    }

    ngOnInit() {
        this.pageTitleService.setTitle('');
    }

    ngOnDestroy() {
        this.authInfoSub.unsubscribe();
    }
}
