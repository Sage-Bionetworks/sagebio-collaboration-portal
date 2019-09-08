import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { Entity } from 'models/entities/entity.model';
// import { EntityDiscussionComponent } from 'components/entity/entity-discussion/entity-discussion.component';
import { switchMap, catchError } from 'rxjs/operators';
import { ToolService } from '../tool.service';
import { Tool } from 'models/entities/tool.model';
import { PageTitleService } from 'components/page-title/page-title.service';
import config from '../../../app/app.constants';
import { ToolDataService } from '../tool-data.service';

@Component({
    selector: 'tool-discussion',
    template: require('./tool-discussion.html'),
    styles: [require('./tool-discussion.scss')],
})
export class ToolDiscussionComponent implements OnInit {
    private tool: Tool;
    private entityType: string;

    static parameters = [Router, ActivatedRoute, PageTitleService, ToolService, ToolDataService];
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private pageTitleService: PageTitleService,
        private toolService: ToolService,
        private toolDataService: ToolDataService
    ) {
        this.entityType = config.entityTypes.TOOL.value;
    }

    ngOnInit() {
        // const getTool = this.route.params.pipe(switchMap(res => this.toolService.get(res.id)));

        this.toolDataService.tool().subscribe(
            tool => {
                this.tool = tool;
                if (tool) {
                    this.pageTitleService.title = `${tool.title} - Discussion`;
                }
            },
            err => console.error(err)
        );
    }
}
