import { ToolAuthorizationService } from './../tool-authorization.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Subscription, Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { PageTitleService } from 'components/page-title/page-title.service';
import { NotificationService } from 'components/notification/notification.service';
import { ToolService } from '../tool.service';
import { Tool } from 'models/entities/tool.model';
import { ToolHealth } from 'models/entities/tool-health.model';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { ToolEditComponent } from '../tool-edit/tool-edit.component';
import { omit } from 'lodash';
import { ToolDataService } from '../tool-data.service';
import config from '../../app.constants';
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

    private canEditTool = false;

    private toolSub: Subscription;
    private canEditToolSub: Subscription;


    private entityType: string;

    static parameters = [
        Router,
        ActivatedRoute,
        PageTitleService,
        ToolService,
        ToolAuthorizationService,
        ToolDataService,
        UserPermissionDataService,
        NotificationService,
        MatDialog,
        TokenService,
    ];
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private pageTitleService: PageTitleService,
        private toolService: ToolService,
        private toolAuthorizationService: ToolAuthorizationService,
        private toolDataService: ToolDataService,
        private userPermissionDataService: UserPermissionDataService,
        private notificationService: NotificationService,
        private dialog: MatDialog,
        private tokenService: TokenService
    ) {
        this.entityType = config.entityTypes.TOOL.value;
    }

    ngOnInit() {
        this.tool$ = this.toolDataService.tool();

        this.canEditToolSub = this.tool$
            .pipe(switchMap(tool => this.toolAuthorizationService.canEdit(tool._id)))
            .subscribe(
                canEdit => {
                    this.canEditTool = canEdit;
                },
                err => console.error(err)
            );

        this.toolSub = this.tool$.subscribe(
            tool => {
                if (tool) {
                    this.pageTitleService.setTitle(tool.title);
                }
            },
            err => console.log(err)
        );
    }

    ngOnDestroy() {
        if (this.canEditToolSub) {
            this.canEditToolSub.unsubscribe();
        }
        if (this.toolSub) {
            this.toolSub.unsubscribe();
        }
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
