import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Tool } from 'models/entities/tool.model';
import { ToolHealth } from 'models/entities/tool-health.model';
import { stringifyQuery } from 'components/util';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';
import { ActivitySidenavComponent } from 'components/activity/activity-sidenav/activity-sidenav.component';
import { EntityService } from 'components/entity/entity.service';
import { QueryListResponse } from 'models/query-list-response.model';
import { Patch } from 'models/patch.model';

@Injectable()
export class ToolService implements EntityService<Tool> {
    static parameters = [HttpClient, SecondarySidenavService];
    constructor(private httpClient: HttpClient, private secondarySidenavService: SecondarySidenavService) {}

    query(query?: {}): Observable<QueryListResponse<Tool>> {
        return this.httpClient.get<QueryListResponse<Tool>>(`/api/tools${stringifyQuery(query)}`);
    }

    get(id: string): Observable<Tool> {
        return this.httpClient.get<Tool>(`/api/tools/${id}`);
    }

    getBySlug(slug: string): Observable<Tool> {
        throw new Error('Method not implemented.');
    }

    create(tool: Tool): Observable<Tool> {
        return this.httpClient.post<Tool>('/api/tools', tool);
    }

    update(id: string, patches: Patch[]): Observable<Tool> {
        return this.httpClient.patch<Tool>(`/api/tools/${id}`, patches);
    }

    remove(tool: Tool): Observable<Tool> {
        return this.httpClient.delete(`/api/tools/${tool._id}`).pipe(map(() => tool));
    }

    makePublic(entity: Tool): Observable<Tool> {
        throw new Error('Method not implemented.');
    }

    makePrivate(entity: Tool): Observable<Tool> {
        throw new Error('Method not implemented.');
    }

    searchByTitle(terms: Observable<string>): Observable<Tool[] | null> {
        return terms.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(term => {
                if (term) {
                    return this.httpClient.get<Tool[]>(`/api/tools?title=${term}`);
                } else {
                    return of(null);
                }
            })
        );
    }

    // MODEL FUNCTIONS

    getEntitySubType(tool: Tool): string {
        return null;
    }

    getRouterLink(tool: Tool): string[] {
        return ['/tools', tool._id];
    }

    // FUNCTIONS TO REVIEW

    getToolHealth(tool: Tool): Observable<ToolHealth> {
        return this.httpClient.get<ToolHealth>(`${tool.apiHealthCheckUrl}/health`);
    }

    showActivity(tool: Tool): void {
        let sidenavContentId = `activity:${tool._id}`;
        if (this.secondarySidenavService.getContentId() !== sidenavContentId) {
            (<ActivitySidenavComponent>(
                this.secondarySidenavService.loadContentComponent(ActivitySidenavComponent)
            )).setRoot(tool);
            this.secondarySidenavService.setContentId(sidenavContentId);
        }
        this.secondarySidenavService.open();
    }
}
