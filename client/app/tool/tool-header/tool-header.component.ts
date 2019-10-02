import { Component, Input, OnInit } from '@angular/core';
import { Tool } from 'models/entities/tool.model';
import { ToolHeaderService } from './tool-header.service';
import { ToolHeaderButtonData } from './models/tool-header-button-data.model';

@Component({
    selector: 'tool-header',
    template: require('./tool-header.html'),
    styles: [require('./tool-header.scss')],
})
export class ToolHeaderComponent implements OnInit {
    private _tool: Tool;
    private actionButtonData: ToolHeaderButtonData; // used in html

    static parameters = [ToolHeaderService];
    constructor(private toolHeaderService: ToolHeaderService) {}

    ngOnInit() {
        this.toolHeaderService.actionButtonData().subscribe(
            data => {
                this.actionButtonData = data;
            },
            err => console.error(err)
        );
    }

    get tool(): Tool {
        return this._tool;
    }

    @Input()
    set tool(tool: Tool) {
        this._tool = tool;
    }
}
