import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Tool } from 'models/entities/tool.model';
import { ToolDataService } from '../tool-data.service';
import { ToolHeaderService } from '../tool-header/tool-header.service';
import config from '../../../app/app.constants';

@Component({
    selector: 'tool-discussion',
    template: require('./tool-discussion.html'),
    styles: [require('./tool-discussion.scss')],
})
export class ToolDiscussionComponent implements OnInit, OnDestroy {
    private tool$: Observable<Tool>; // used in html
    private entityType: string; // used in html

    static parameters = [ToolDataService, ToolHeaderService];
    constructor(private toolDataService: ToolDataService, private toolHeaderService: ToolHeaderService) {
        this.entityType = config.entityTypes.TOOL.value;
    }

    ngOnInit() {
        this.tool$ = this.toolDataService.tool();
        this.toolHeaderService.showNewDiscussionButton();
    }

    ngOnDestroy() {
        this.toolHeaderService.hideActionButton();
    }
}
