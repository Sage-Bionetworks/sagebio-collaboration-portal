import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UserProfile } from 'models/auth/user-profile.model';
import { AuthService } from 'components/auth/auth.service';
import { Tool } from 'models/entities/tool.model';
import { ToolDataService } from '../tool-data.service';
import { NotificationService } from 'components/notification/notification.service';
import { ToolService } from '../tool.service';

@Component({
    selector: 'tool-settings',
    template: require('./tool-settings.html'),
    styles: [require('./tool-settings.scss')],
})
export class ToolSettingsComponent implements OnDestroy {
    private tool: Observable<Tool>;
    private user: UserProfile;
    private authInfoSub: Subscription;

    static parameters = [ToolDataService, AuthService, NotificationService, ToolService];
    constructor(
        private toolDataService: ToolDataService,
        private authService: AuthService,
        private notificationService: NotificationService,
        private toolService: ToolService
    ) {
        this.tool = this.toolDataService.tool();
        this.authInfoSub = this.authService.authInfo().subscribe(authInfo => (this.user = authInfo.user));
    }

    ngOnDestroy() {
        this.authInfoSub.unsubscribe();
    }
}
