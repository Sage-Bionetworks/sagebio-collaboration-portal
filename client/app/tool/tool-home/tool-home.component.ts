import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Subscription, of, Observable } from 'rxjs';
import { switchMap, catchError, take } from 'rxjs/operators';
import { PageTitleService } from 'components/page-title/page-title.service';
import { NotificationService } from 'components/notification/notification.service';
import { ConfirmationDialog } from 'components/confirmation-dialog/confirmation-dialog.component';
import { ToolService } from '../tool.service';
import { Tool } from 'models/entities/tool.model';
import { ToolHealth } from 'models/entities/tool-health.model';
import { UserPermissionDataService, UserPermissions } from 'components/auth/user-permission-data.service';
import { ToolEditComponent } from '../tool-edit/tool-edit.component';
import { omit } from 'lodash';
import { ToolDataService } from '../tool-data.service';
import config from "../../app.constants";
import { TokenService } from 'components/auth/token.service';

@Component({
    selector: 'tool-home',
    template: require('./tool-home.html'),
    styles: [require('./tool-home.scss')],
})
export class ToolHomeComponent implements OnInit, OnDestroy {
    private tool$: Observable<Tool>;
    @ViewChild(ToolEditComponent, { static: false }) editTool: ToolEditComponent;
    private showEditToolTemplate = false;
    private toolHealth: ToolHealth;

    private canEditTool = true;
    private canDeleteTool = false;
    private userPermissionsSub: Subscription;
    private entityType = config.entityTypes.TOOL.value

    static parameters = [
        Router,
        ActivatedRoute,
        PageTitleService,
        ToolService,
        ToolDataService,
        UserPermissionDataService,
        NotificationService,
        MatDialog,
        TokenService
    ];
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private pageTitleService: PageTitleService,
        private toolService: ToolService,
        private toolDataService: ToolDataService,
        private userPermissionDataService: UserPermissionDataService,
        private notificationService: NotificationService,
        private dialog: MatDialog,
        private tokenService: TokenService
    ) {
        this.tool$ = this.toolDataService.tool();
        this.userPermissionsSub = this.userPermissionDataService.permissions().subscribe(permissions => {
            // this.canEditTool = permissions.canEditTool();
            // this.canDeleteTool = permissions.canDeleteTool();
        });
    }

    ngOnInit() {
        // const getTool = this.toolDataService.tool();

        // const getToolHealth = this.tool$.pipe(  // TODO To review
        //     switchMap(tool =>
        //         this.toolService.getToolHealth(tool).pipe(
        //             catchError(err => {
        //                 return of(<ToolHealth>undefined);
        //             })
        //         )
        //     )
        // );

        this.tool$.subscribe(
            tool => {
                if (tool) {
                    this.pageTitleService.title = tool.title;
                }
            },
            err => console.log(err)
        );

        // getToolHealth.subscribe(toolHealth => {
        //     this.toolHealth = toolHealth;
        // });
    }

    ngOnDestroy() {
        this.userPermissionsSub.unsubscribe();
    }

    onEditTool(tool: Tool): void {
        this.showEditToolTemplate = false;
        this.tool$.pipe(take(1)).subscribe(
            tool_ => {
                tool = { ...tool_, ...omit(tool, 'organization') };
                this.toolDataService.setTool(tool);
                this.notificationService.info('The Tool has been successfully updated');
            },
            err => console.error(err)
        );
    }

    onDeleteTool(): void {
        console.log('DELETE');
    }

    getLink(): string {
        return window.location.href;
    }

    openTool(tool: Tool): void {
        if (tool._id === '5cb7acb3167e4f14b29dfb1b') { // TODO To remove when developing way to interact with tools
            window.open(`${tool.website}?portal_token=${this.tokenService.get()}`, '_blank');
        } else {
            window.open(tool.website, '_blank');
        }
    }
}
