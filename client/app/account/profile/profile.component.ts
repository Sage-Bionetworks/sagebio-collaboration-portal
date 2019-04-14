import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSliderChange } from '@angular/material';
import { AuthService } from '../../../components/auth/auth.service';
import { UserService } from '../../../components/auth/user.service';
import { PageTitleService } from '../../../components/page-title/page-title.service';
import { Subject, forkJoin, Subscription } from 'rxjs';
import { tap, switchMap, map, last } from 'rxjs/operators';
import { HttpEventType } from '@angular/common/http';
import { User } from '../../../../shared/interfaces/user.model';
// import constants from '../../app.constants';
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

    static parameters = [AuthService, UserService, PageTitleService, NotificationService];
    constructor(private authService: AuthService, private userService: UserService,
        private pageTitleService: PageTitleService,
        private notificationService: NotificationService) {
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

    plop(): void {
      console.log('plop');
      this.notificationService.success('Plop');
    }
}
