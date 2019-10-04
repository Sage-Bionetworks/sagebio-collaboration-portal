import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Tool } from 'models/entities/tool.model';
import { PageTitleService } from 'components/page-title/page-title.service';
import { ToolService } from '../tool.service';
import { NotificationService } from 'components/notification/notification.service';
import { ToolAuthorizationService } from '../tool-authorization.service';

@Component({
    selector: 'tool-list',
    template: require('./tool-list.html'),
    styles: [require('./tool-list.scss')],
})
export class ToolListComponent implements OnInit, OnDestroy {
    private canCreateTool = false;
    private canCreateToolSub: Subscription;

    static parameters = [Router, PageTitleService, NotificationService, ToolService, ToolAuthorizationService];
    constructor(
        private router: Router,
        private pageTitleService: PageTitleService,
        private notificationService: NotificationService,
        private toolService: ToolService, // used in html
        private toolAuthorizationService: ToolAuthorizationService
    ) {}

    ngOnInit() {
        this.pageTitleService.title = 'Tools';

        this.canCreateToolSub = this.toolAuthorizationService.canCreate().subscribe(
            canCreate => {
                this.canCreateTool = canCreate;
            },
            err => console.error(err)
        );
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
