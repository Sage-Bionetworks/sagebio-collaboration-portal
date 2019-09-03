import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Tool } from 'models/entities/tool.model';
import { PageTitleService } from 'components/page-title/page-title.service';
import { ToolService } from '../tool.service';

@Component({
    selector: 'tool-list',
    template: require('./tool-list.html'),
    styles: [require('./tool-list.scss')],
})
export class ToolListComponent implements OnInit {
    static parameters = [Router, PageTitleService, ToolService];
    constructor(private router: Router, private pageTitleService: PageTitleService, private toolService: ToolService) {}

    ngOnInit() {
        this.pageTitleService.title = 'Tools';
    }

    onEntityClick(tool: Tool) {
        if (tool) {
            this.router.navigate(['/tools', tool.slug]);
        }
    }
}
