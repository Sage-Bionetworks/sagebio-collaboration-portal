import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'components/auth/auth.service';
import { PageTitleService } from 'components/page-title/page-title.service';

@Component({
    selector: 'app-main',
    template: require('./main.html'),
    styles: [require('./main.scss')],
})
export class MainComponent implements OnInit, OnDestroy {
    private isLoggedIn = false; // used in html
    private authInfoSub: Subscription;

    static parameters = [AuthService, PageTitleService];
    constructor(private authService: AuthService, private pageTitleService: PageTitleService) {}

    ngOnInit() {
        this.authInfoSub = this.authService.authInfo().subscribe(authInfo => {
            this.isLoggedIn = authInfo.isLoggedIn();
        });
        this.pageTitleService.setTitle('');
    }

    ngOnDestroy() {
        this.authInfoSub.unsubscribe();
    }
}
