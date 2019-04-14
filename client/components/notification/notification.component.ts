import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material';
import { Notification, NotificationType } from './notification.model';
import { NotificationService } from './notification.service';
// import { SnackBarComponent } from './snack-bar/snack-bar.component';

@Component({
    selector: 'app-notification',
    template: require('./notification.html'),
    styles: [require('./notification.scss')],
    encapsulation: ViewEncapsulation.None
})

export class NotificationComponent {
    private duration = 2500;

    static parameters = [MatSnackBar, NotificationService];
    constructor(private snackBar: MatSnackBar,
        private notificationService: NotificationService) { }

    ngOnInit() {
        this.notificationService.getAlert()
            .subscribe((alert: Notification) => {
                if (!alert) {
                    return;
                }
                let snackBarRef = this.snackBar.open(alert.message, alert.action, {  // additional config
                    duration: this.duration,
                    panelClass: [`app-notification-snackbar-${alert.type}`]
                });
                // let snackBarRef = this.snackBar.openFromComponent(SnackBarComponent, {
                //     duration: this.duration,
                //     data: alert
                // });
                // snackBarRef.onAction().subscribe(() => {
                // });
            });
    }
}
