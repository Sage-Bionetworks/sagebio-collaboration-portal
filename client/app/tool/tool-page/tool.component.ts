import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Observable, Subscription, forkJoin, combineLatest, of, empty, never } from 'rxjs';
import { filter, map, switchMap, tap, concatMap, mergeMap, catchError } from 'rxjs/operators';
import { PageTitleService } from 'components/page-title/page-title.service';
import { NotificationService } from 'components/notification/notification.service';
import { ConfirmationDialog } from 'components/confirmation-dialog/confirmation-dialog.component';
import { ToolService } from '../tool.service';
import { Tool } from 'models/tool.model';
import { ToolHealth } from 'models/tool-health.model';
import { UserPermissionDataService, UserPermissions } from 'components/auth/user-permission-data.service';
import { User } from 'models/auth/user.model';

@Component({
    selector: 'tool',
    template: require('./tool.html'),
    styles: [require('./tool.scss')],
})
export class ToolComponent implements OnInit, OnDestroy {
    private tool: Tool;
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

        this.userPermissionsSub = this.userPermissionDataService.getPermissions()
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
}
