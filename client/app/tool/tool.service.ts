import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    map,
    switchMap,
    tap
} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Tool } from 'models/entities/tool.model';
import { ToolHealth } from 'models/entities/tool-health.model';
import { stringifyQuery } from 'components/util';
import { some, orderBy, head } from 'lodash/fp';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';
import { ActivitySidenavComponent } from 'components/activity/activity-sidenav/activity-sidenav.component';

@Injectable()
export class ToolService {

    static parameters = [HttpClient, SecondarySidenavService];
    constructor(private httpClient: HttpClient,
        private secondarySidenavService: SecondarySidenavService) { }

    getTools(query?: {}): Observable<Tool[]> {
        return this.httpClient.get<Tool[]>(`/api/tools${stringifyQuery(query)}`)
            .pipe(
                map(tools => orderBy('title', 'asc', tools))
            );
    }

    getTool(toolId: string): Observable<Tool> {
        return this.httpClient.get<Tool>(`/api/tools/${toolId}`);
    }

    getToolBySlug(slug: string): Observable<Tool> {
        return this.getTools({ slug: slug })
            .pipe(
                map(tools => head(tools))
            );
    }

    updateTool(patches: Object[], toolId: String): Observable<Tool> {
        return this.httpClient.patch<Tool>(`/api/tools/${toolId}`, patches);
    }

    // getToolsByResourceFormat(resourceFormat: string): Observable<Tool[]> {
    //     return this.httpClient.get<Tool[]>(`/api/tools`)
    //         .pipe(
    //             map(tools => tools.filter(tool => some(resourceFormat, tool.resourceFormats))),
    //             map(tools => orderBy('name', 'asc', tools))
    //         );
    // }

    // searchToolsByName(terms: Observable<string>): Observable<Tool[] | null> {
    //     return terms
    //         .pipe(
    //             debounceTime(400),
    //             distinctUntilChanged(),
    //             switchMap(term => term ? this.getTools({ searchTerms: term }) : of(null))
    //         );
    // }

    getToolHealth(tool: Tool): Observable<ToolHealth> {
        return this.httpClient.get<ToolHealth>(`${tool.apiHealthCheckUrl}/health`);
    }

    create(tool: Tool): Observable<Tool> {
        return this.httpClient.post<Tool>('/api/tools', tool);
    }

    remove(tool: Tool): Observable<Tool> {
        return this.httpClient.delete(`/api/tools/${tool._id}`)
            .pipe(
                map(() => tool)
            );
    }

    showActivity(tool: Tool): void {
        let sidenavContentId = `activity:${tool._id}`;
        if (this.secondarySidenavService.getContentId() !== sidenavContentId) {
            (<ActivitySidenavComponent>this.secondarySidenavService
                .loadContentComponent(ActivitySidenavComponent))
                .setRoot(tool);
            this.secondarySidenavService.setContentId(sidenavContentId);
        }
        this.secondarySidenavService.open();
    }
}
