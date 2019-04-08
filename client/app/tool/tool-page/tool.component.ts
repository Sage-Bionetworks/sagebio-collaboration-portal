import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ToolService } from '../tool.service';
import { Tool } from '../../../../shared/interfaces/tool.model';
import { PageTitleService } from '../../../components/page-title/page-title.service';

@Component({
    selector: 'tool',
    template: require('./tool.html'),
    styles: [require('./tool.scss')],
})
export class ToolComponent implements OnInit, OnDestroy {
    private tool: Tool;

    static parameters = [Router, ActivatedRoute, PageTitleService, ToolService];
    constructor(private router: Router, private route: ActivatedRoute,
        private pageTitleService: PageTitleService, private toolService: ToolService) { }

    ngOnInit() {
        this.route.params.subscribe(res => {
            this.toolService.getTool(res.id).subscribe(tool => {
                // // Get the instances of this tool available to the user
                // this.AuthService.isLoggedIn().subscribe(is => {
                //   if (is) {
                //     this.InstanceService.queryBytool(tool)
                //       .subscribe(instances => {
                //         this.instances = instances;
                //         this.SocketService.syncUpdates('instance', this.instances);
                //       })
                //   }
                // });
                this.pageTitleService.title = tool.name;
                this.tool = tool;
            });
        });
    }

    ngOnDestroy() { }

    // openCkan(tool: Tool): void {
    //     console.log('Not implemented.');
    // }
    //
    // openFacileExplorer(tool: Tool): void {
    //     console.log('Not implemented');
    // }
}
