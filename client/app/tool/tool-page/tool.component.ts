import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Subscription, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { PageTitleService } from 'components/page-title/page-title.service';
import { NotificationService } from 'components/notification/notification.service';
import { ConfirmationDialog } from 'components/confirmation-dialog/confirmation-dialog.component';
import { ToolService } from '../tool.service';
import { Tool } from 'models/entities/tool.model';
import { ToolHealth } from 'models/entities/tool-health.model';
import { UserPermissionDataService, UserPermissions } from 'components/auth/user-permission-data.service';
import { ToolEditComponent } from '../tool-edit/tool-edit.component';
import { omit } from 'lodash';

@Component({
    selector: 'tool',
    template: require('./tool.html'),
    styles: [require('./tool.scss')],
})
export class ToolComponent implements OnInit, OnDestroy {
    private tool: Tool;
    @ViewChild(ToolEditComponent, { static: false }) editTool: ToolEditComponent;
    private showEditToolTemplate = false;
    private toolHealth: ToolHealth;

    private canEditTool = false;
    private canDeleteTool = false;
    private userPermissionsSub: Subscription;

    static parameters = [Router, ActivatedRoute, PageTitleService, ToolService,
        UserPermissionDataService, NotificationService, MatDialog];
    constructor(private router: Router, private route: ActivatedRoute,
        private pageTitleService: PageTitleService, private toolService: ToolService,
        private userPermissionDataService: UserPermissionDataService,
        private notificationService: NotificationService,
        private dialog: MatDialog) {

        this.userPermissionsSub = this.userPermissionDataService.permissions()
            .subscribe(permissions => {
                this.canEditTool = permissions.canEditTool();
                this.canDeleteTool = permissions.canDeleteTool();
            });
    }

    ngOnInit() {
        const getTool = this.route.params.pipe(
            switchMap(res => this.toolService.getToolBySlug(res.slug))
        );

        const getToolHealth = getTool.
            pipe(
                switchMap(tool => this.toolService.getToolHealth(tool)
                    .pipe(
                        catchError(err => {
                            return of(<ToolHealth>undefined);
                        })
                    ))
            );

        getTool
            .subscribe(tool => {
                this.tool = tool;
                this.pageTitleService.title = tool.name;
            }, err => console.log(err));


        getToolHealth
            .subscribe(toolHealth => {
                this.toolHealth = toolHealth;
            });
    }

    ngOnDestroy() {
        this.userPermissionsSub.unsubscribe();
    }

    deleteTool(): void {
        this.toolService.remove(this.tool)
            .subscribe(deletedTool => {
                this.router.navigateByUrl('tools');
                this.notificationService.info(`${deletedTool.name} has been successfully deleted'`);
            }, err => {
                console.log(err);
                this.notificationService.error(`Unable to delete the tool ${this.tool.name}'`);
            });
    }

    displayConfirmationDialog(): void {
        this.dialog.open(ConfirmationDialog, {
            data: {
                message: `Are you sure you want to delete this tool? This action cannot be reversed!`,
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
            .subscribe((confirmed: boolean) => confirmed && this.deleteTool());
    }

    onEditTool(tool: Tool): void {
        this.showEditToolTemplate = false;
        this.tool = { ...this.tool, ... omit(tool, 'organization')};
        this.notificationService.info('The Tool has been successfully updated');
    }

    showActivity(): void {
        this.toolService.showActivity(this.tool);
    }
}
