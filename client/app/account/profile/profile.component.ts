import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSliderChange } from '@angular/material';
import { AuthService } from '../../../components/auth/auth.service';
import { UserService } from '../../../components/auth/user.service';
import { PageTitleService } from '../../../components/page-title/page-title.service';
import { Subject, forkJoin, Subscription } from 'rxjs';
import { tap, switchMap, map, last } from 'rxjs/operators';
import { HttpEventType } from '@angular/common/http';
import { User } from '../../../../shared/interfaces/user.model';
import { NotificationService } from '../../../components/notification/notification.service';

@Component({
    selector: 'profile',
    template: require('./profile.html'),
    styles: [require('./profile.scss')],
    encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit, OnDestroy {
    currentUser: User;
    authInfoSub: Subscription;

    static parameters = [AuthService, UserService, PageTitleService];
    constructor(private authService: AuthService, private userService: UserService,
        private pageTitleService: PageTitleService) {
        this.authInfoSub = this.authService.authInfo()
            .subscribe(authInfo => {
                this.currentUser = authInfo.user;
            });
    }

    ngOnInit() {
        this.pageTitleService.title = 'Profile';
    }

    ngOnDestroy() {
        this.authInfoSub.unsubscribe();
    }
}
