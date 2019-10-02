import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { Tool } from 'models/entities/tool.model';
import { ToolService } from './tool.service';
import { ToolDataService } from './tool-data.service';
import { ToolSidenavService } from './tool-sidenav/tool-sidenav.service';
import { ToolHeaderService } from './tool-header/tool-header.service';

@Component({
    selector: 'tool',
    template: require('./tool.html'),
    styles: [require('./tool.scss')],
    providers: [ToolDataService, ToolHeaderService, ToolSidenavService],
})
export class ToolComponent implements OnInit {
    private tool$: Observable<Tool>; // used in html

    static parameters = [ActivatedRoute, ToolService, ToolDataService, ToolSidenavService];
    constructor(
        private route: ActivatedRoute,
        private toolService: ToolService,
        private toolDataService: ToolDataService,
        private toolSidenavService: ToolSidenavService // used in html
    ) {}

    ngOnInit() {
        const getTool = this.route.params.pipe(
            switchMap(res =>
                this.toolService.get(res.id).pipe(
                    catchError(err => {
                        console.error(err);
                        return of(<Tool>undefined);
                    })
                )
            )
        );

        getTool.subscribe(tool => {
            this.toolDataService.setTool(tool);
        });

        this.tool$ = this.toolDataService.tool();
    }
}
