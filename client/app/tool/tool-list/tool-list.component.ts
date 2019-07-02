import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, ContentChildren, QueryList, forwardRef } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToolService } from '../tool.service';
import { Tool } from '../../../../shared/interfaces/tool.model';
import { PageTitleService } from '../../../components/page-title/page-title.service';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { orderBy } from 'lodash/fp';
import { NotificationService } from '../../../components/notification/notification.service'
// import { ToolNewComponent } from '../tool-new/tool-new.component';

@Component({
    selector: 'tool-list',
    template: require('./tool-list.html'),
    styles: [require('./tool-list.scss')],
})
export class ToolListComponent implements OnInit, AfterViewInit {
    private tools: Observable<Tool[]>;

    // @ViewChild(ToolNewComponent, { static: false }) newTool: ToolNewComponent;
    private createNewTool = false

    static parameters = [Router, FormBuilder, PageTitleService, ToolService, NotificationService];
    constructor(private router: Router, private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private toolService: ToolService,
        private notificationService: NotificationService) {
        this.tools = this.toolService.getTools()
            .pipe(
                map(tools => orderBy('name', 'asc', tools))
            );
    }

    ngOnInit() {
        this.pageTitleService.title = 'Tools';
    }

    ngAfterViewInit() {
    }

    onNewTool(tool: Tool): void {
        this.createNewTool = false;
        this.notificationService.info('The Tool has been successfully created');
    }
}
