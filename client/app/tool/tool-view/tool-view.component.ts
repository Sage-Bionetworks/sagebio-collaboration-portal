import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ToolService } from '../tool.service';
import { Tool } from '../../../../shared/interfaces/tool.model';

@Component({
    selector: 'tool-view',
    template: require('./tool-view.html'),
    styles: [require('./tool-view.scss')],
})
export class ToolViewComponent {
    private _tool: Tool;

    static parameters = [Router];
    constructor(private router: Router) { }

    get tool() {
        return this._tool;
    }

    @Input()
    set tool(tool) {
        this._tool = tool;
    }
}
