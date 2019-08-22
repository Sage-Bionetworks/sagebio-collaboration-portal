import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { Entity } from 'models/entities/entity.model';
// import { EntityDiscussionComponent } from 'components/entity/entity-discussion/entity-discussion.component';
import { switchMap, catchError } from 'rxjs/operators';
import { ToolService } from '../tool.service';
import { Tool } from 'models/entities/tool.model';
import { PageTitleService } from 'components/page-title/page-title.service';

@Component({
    selector: 'tool-discussion',
    template: require('./tool-discussion.html'),
    styles: [require('./tool-discussion.scss')],
})
export class ToolDiscussionComponent implements OnInit {
    private tool: Tool;

    static parameters = [Router, ActivatedRoute, ToolService, PageTitleService];
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private toolService: ToolService,
        private pageTitleService: PageTitleService
    ) {}

    ngOnInit() {
        const getTool = this.route.params.pipe(switchMap(res => this.toolService.getToolBySlug(res.slug)));

        getTool.subscribe(
            tool => {
                this.tool = tool;
                this.pageTitleService.title = `${tool.title} - Discussion`;
            },
            err => console.log(err)
        );
    }
}
