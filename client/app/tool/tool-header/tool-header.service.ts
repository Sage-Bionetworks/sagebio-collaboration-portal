import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Tool } from 'models/entities/tool.model';
import { ToolHeaderButtonData } from './models/tool-header-button-data.model';
import { ToolDataService } from '../tool-data.service';

@Injectable()
export class ToolHeaderService {
    private _actionButtonData: BehaviorSubject<ToolHeaderButtonData> = new BehaviorSubject<ToolHeaderButtonData>(null);
    private tool: Tool;

    static parameters = [ToolDataService];
    constructor(private toolDataService: ToolDataService) {
        this.toolDataService.tool().subscribe(
            tool => {
                this.tool = tool;
            },
            err => console.error(err)
        );
    }

    actionButtonData(): Observable<ToolHeaderButtonData> {
        return this._actionButtonData.asObservable();
    }

    showNewToolButton(): void {
        if (this.tool) {
            this._actionButtonData.next({
                title: 'New Tool',
                routerLink: ['/tools', 'new'],
            });
        }
    }

    showNewDiscussionButton(): void {
        if (this.tool) {
            this._actionButtonData.next({
                title: 'New Thread',
                routerLink: ['/tools', this.tool._id, 'discussion', 'new'],
            });
        }
    }

    hideActionButton(): void {
        this._actionButtonData.next(null);
    }
}
