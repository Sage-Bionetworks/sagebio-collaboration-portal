import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageTitleService } from 'components/page-title/page-title.service';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { Tool } from 'models/entities/tool.model';
import { ToolService } from '../tool.service';

@Component({
    selector: 'tool-list',
    template: require('./tool-list.html'),
    styles: [require('./tool-list.scss')],
})
export class ToolListComponent implements OnInit {
    private canCreateTools = false; // used in html

    static parameters = [Router, PageTitleService, UserPermissionDataService, ToolService];
    constructor(
        private router: Router,
        private pageTitleService: PageTitleService,
        private permissionDataService: UserPermissionDataService,
        private toolService: ToolService // used in html
    ) {}

    ngOnInit() {
        this.pageTitleService.title = 'Tools';
        this.permissionDataService
            .permissions()
            .subscribe(
                permissions => (this.canCreateTools = permissions.canCreateTools()),
                err => console.error(err)
            );
    }

    onEntityClick(tool: Tool) {
        if (tool) {
            this.router.navigate(['/tools', tool._id]);
        }
    }
}
