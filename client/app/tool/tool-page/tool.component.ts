import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ToolService } from '../tool.service';
import { Tool } from '../../../../shared/interfaces/tool.model';
import { ToolHealth } from '../../../../shared/interfaces/tool-health.model';
import { PageTitleService } from '../../../components/page-title/page-title.service';
import { Observable, forkJoin, combineLatest, of, empty, never } from 'rxjs';
import { filter, map, switchMap, tap, concatMap, mergeMap, catchError } from 'rxjs/operators';

@Component({
    selector: 'tool',
    template: require('./tool.html'),
    styles: [require('./tool.scss')],
})
export class ToolComponent implements OnInit, OnDestroy {
    private tool: Tool;
    private toolHealth: ToolHealth;

    static parameters = [Router, ActivatedRoute, PageTitleService, ToolService];
    constructor(private router: Router, private route: ActivatedRoute,
        private pageTitleService: PageTitleService, private toolService: ToolService) { }

    ngOnInit() {
        const tool$ = this.route.params.pipe(
            switchMap(res => this.toolService.getToolBySlug(res.slug))
        );
        const toolHealth$ = tool$.pipe(
            switchMap(tool => this.toolService.getToolHealth(tool)
                .pipe(
                    catchError(err => {
                        // console.log(err);
                        // this.notificationService.error('Unable to connect to Data Catalog');
                        return of(<ToolHealth>{});
                    })
                ))
        );

        combineLatest(tool$, toolHealth$)
            .subscribe(([tool, toolHealth]) => {
                this.toolHealth = toolHealth;
                this.tool = tool;
                this.pageTitleService.title = tool.name;
                // this.catalogStats = stats;
                // this.catalog = catalog;
                // this.pageTitleService.title = catalog.name;
            });
        // this.route.params
        //     .pipe(
        //         switchMap(res => this.toolService.getTool(res.id))
        //     )
        //     .subscribe(tool => {
        //         this.pageTitleService.title = tool.name;
        //         this.tool = tool;
        //     });
    }

    ngOnDestroy() { }
}
