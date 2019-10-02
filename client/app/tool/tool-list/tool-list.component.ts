import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Tool } from 'models/entities/tool.model';
import { PageTitleService } from 'components/page-title/page-title.service';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { ToolService } from '../tool.service';
import { NotificationService } from 'components/notification/notification.service';

@Component({
    selector: 'tool-list',
    template: require('./tool-list.html'),
    styles: [require('./tool-list.scss')],
})
export class ToolListComponent implements OnInit, OnDestroy {
    private canCreateTool = false; // used in html
    private canCreateToolSub: Subscription;

    static parameters = [Router, PageTitleService, UserPermissionDataService, NotificationService, ToolService];
    constructor(
        private router: Router,
        private pageTitleService: PageTitleService,
        private permissionDataService: UserPermissionDataService,
        private notificationService: NotificationService,
        private toolService: ToolService // used in html
    ) {}

    ngOnInit() {
        this.pageTitleService.title = 'Tools';
        this.canCreateToolSub = this.permissionDataService
            .permissions()
            .subscribe(permissions => (this.canCreateTool = permissions.canCreateTool()), err => console.error(err));
    }

    ngOnDestroy() {
        if (this.canCreateToolSub) {
            this.canCreateToolSub.unsubscribe();
        }
    }

    onEntityClick(tool: Tool) {
        if (tool) {
            this.router.navigate(['/tools', tool._id]);
        }
    }

    newTool(): void {
        if (this.canCreateTool) {
            this.router.navigate(['/', 'tools', 'new']);
        } else {
            this.notificationService.info('Not available to Users yet.');
        }
    }
}
