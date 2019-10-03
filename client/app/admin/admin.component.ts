import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'components/auth/user.service';
import { PageTitleService } from 'components/page-title/page-title.service';
import { UserProfile } from 'models/auth/user-profile.model';
import { NotificationService } from 'components/notification/notification.service';
import { MatDialog } from '@angular/material';
import { ConfirmationDialog } from 'components/confirmation-dialog/confirmation-dialog.component';
import config from '../app.constants';

@Component({
    selector: 'admin',
    template: require('./admin.html'),
    styles: [require('./admin.scss')],
})
export class AdminComponent implements OnInit, OnDestroy {
    private users: UserProfile[];
    private avatarSize;

    static parameters = [UserService, PageTitleService, NotificationService, MatDialog];
    constructor(private userService: UserService,
        private pageTitleService: PageTitleService,
        private notificationService: NotificationService,
        private dialog: MatDialog) {
        this.userService.query()
            .subscribe(users => this.users = users);
        this.avatarSize = config.avatar.size.small;
    }

    ngOnInit() {
        this.pageTitleService.setTitle('Admin');
    }

    ngOnDestroy() { }

    deleteUser(user) {
        this.userService.remove(user)
            .subscribe(deletedUser => {
                this.users.splice(this.users.indexOf(deletedUser), 1);
                this.notificationService.info('User Successfully Removed');
            });
    }

    displayConfirmationDialog($event, user): void {
        $event.stopPropagation();
        this.dialog.open(ConfirmationDialog, {
            data: {
                message: `Are you sure you want to delete this user? This action cannot be reversed!`,
                confirmButton: {
                    text: 'Delete',
                    color: 'warn',
                },
                cancelButton: {
                    text: 'Cancel',
                    color: 'background',
                }
            }
        })
            .afterClosed()
            .subscribe((confirmed: boolean) => confirmed && this.deleteUser(user));
    }
}
