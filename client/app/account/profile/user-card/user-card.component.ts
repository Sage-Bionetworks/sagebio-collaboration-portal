import { Component, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'models/auth/user.model';
import { NotificationService } from 'components/notification/notification.service';
import { UserCardEditComponent } from '../user-card-edit/user-card-edit.component';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';
import { ActivitySidenavComponent } from 'components/activity/activity-sidenav/activity-sidenav.component';

@Component({
    selector: 'user-card',
    template: require('./user-card.html'),
    styles: [require('./user-card.scss')],
})
export class UserCardComponent {
    private _user: User;
    private isEditing = false;
    @ViewChild(UserCardEditComponent, { static: false }) editUser: UserCardEditComponent;

    static parameters = [Router, NotificationService, SecondarySidenavService];
    constructor(private router: Router,
        private notificationService: NotificationService,
        private secondarySidenavService: SecondarySidenavService) { }

    get buttonColor() {
        if (this.isEditing) return 'accent';
        return 'primary';
    }

    get buttonText() {
        if (this.isEditing) return 'Save Profile';
        return 'Edit Profile';
    }

    get user() {
        return this._user;
    }

    @Input()
    set user(user) {
        this._user = user;
    }

    onEditUser(user: User): void {
        this.isEditing = false;
        this.user = user;
        this.notificationService.info('Your profile has been successfully updated.');
    }

    showActivity(): void {
        let sidenavContentId = `activity:${this._user._id}`;
        if (this.secondarySidenavService.getContentId() !== sidenavContentId) {
            (<ActivitySidenavComponent>this.secondarySidenavService
                .loadContentComponent(ActivitySidenavComponent))
                .setUser(this._user);
            this.secondarySidenavService.setContentId(sidenavContentId);
        }
        this.secondarySidenavService.open();
    }

}
