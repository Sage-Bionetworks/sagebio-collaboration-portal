import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { Entity } from 'models/entities/entity.model';
// import { EntityDiscussionComponent } from 'components/entity/entity-discussion/entity-discussion.component';
import { switchMap, catchError } from 'rxjs/operators';
import { ToolService } from '../tool.service';
import { Tool } from 'models/entities/tool.model';
import { PageTitleService } from 'components/page-title/page-title.service';
import config from '../../../app/app.constants';

@Component({
    selector: 'tool-thread-list',
    template: require('./tool-thread-list.html'),
    styles: [require('./tool-thread-list.scss')],
})
export class ToolThreadListComponent implements OnInit {
    private tool: Tool;
    private entityType: string;

    static parameters = [Router, ActivatedRoute, ToolService, PageTitleService];
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private toolService: ToolService,
        private pageTitleService: PageTitleService
    ) {
        this.entityType = config.entityTypes.TOOL.value;
    }

    ngOnInit() {
        const getTool = this.route.params.pipe(switchMap(res => this.toolService.get(res.id)));

        getTool.subscribe(
            tool => {
                this.tool = tool;
                this.pageTitleService.title = `${tool.title} - Discussion`;
            },
            err => console.log(err)
        );
    }
}
