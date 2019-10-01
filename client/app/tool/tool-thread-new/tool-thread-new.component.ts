import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Thread } from 'models/messaging/thread.model';
import { Tool } from 'models/entities/tool.model';
import { ToolDataService } from '../tool-data.service';
import config from '../../app.constants';

@Component({
    selector: 'tool-thread-new',
    template: require('./tool-thread-new.html'),
    styles: [require('./tool-thread-new.scss')],
})
export class ToolThreadNewComponent implements OnInit {
    private tool$: Observable<Tool>;
    private entityType: string;

    static parameters = [Router, ActivatedRoute, ToolDataService];
    constructor(private router: Router, private route: ActivatedRoute, private toolDataService: ToolDataService) {
        this.entityType = config.entityTypes.TOOL.value;
    }

    ngOnInit() {
        this.tool$ = this.toolDataService.tool();
    }

    onNewThread(thread: Thread): void {
        if (thread) {
            this.router.navigate(['..', thread._id], { relativeTo: this.route });
        }
    }

    onClose(): void {
        this.router.navigate(['..'], { relativeTo: this.route });
    }
}
