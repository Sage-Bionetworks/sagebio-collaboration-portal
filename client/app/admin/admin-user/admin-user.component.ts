import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../components/auth/user.service';
import { PageTitleService } from '../../../components/page-title/page-title.service';
import { UserProfile } from '../../../../shared/interfaces/user-profile.model';
import { User } from '../../../../shared/interfaces/user.model';

import { switchMap } from 'rxjs/operators';
// import config from '../../../app/app.constants';

// // import { ImagePipe, WebpPipe } from '../../components/image/image.pipe';

@Component({
    selector: 'admin-user',
    template: require('./admin-user.html'),
    styles: [require('./admin-user.scss')],
})
export class AdminUserComponent implements OnInit, OnDestroy {
    private user: User;

    static parameters = [Router, UserService, PageTitleService];
    constructor(private router: Router, private route: ActivatedRoute, private userService: UserService,
        private pageTitleService: PageTitleService) { }

        ngOnInit() {
        this.pageTitleService.title = 'User Permissions';
        // // Use the user service to fetch all users
        const user$ = this.route.params.pipe(
          switchMap(res => this.userService.get(res.id))
        )

        user$
          .subscribe(user => {
            console.log('user: ', user);
              this.user = user;
          });

    }

    ngOnDestroy() { }

    // deleteUser(user) {
    //     this.userService.remove(user).subscribe(deletedUser => {
    //         this.users.splice(this.users.indexOf(deletedUser), 1);
    //     });
    // }
}
