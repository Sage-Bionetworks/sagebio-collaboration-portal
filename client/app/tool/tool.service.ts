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
import { EntityAttachment } from 'models/entities/entity-attachment.model';
import { StringValue } from 'models/string-value.model';
import config from '../app.constants';

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

    isPublic(id: string): Observable<boolean> {
        // TODO Restore meaningful code when tools fully support ACL
        // For now tools are considered public
        return of(true);
        // return this.httpClient
        //     .get<StringValue>(`/api/tools/${id}/visibility`)
        //     .pipe(map(res => res.value === config.entityVisibility.PUBLIC.value));
    }

    makePublic(entity: Tool): Observable<Tool> {
        throw new Error('Method not implemented.');
    }

    makePrivate(entity: Tool): Observable<Tool> {
        throw new Error('Method not implemented.');
    }

    searchByTerms(terms: Observable<string>): Observable<QueryListResponse<Tool>> {
        return terms.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(term => {
                if (term) {
                    return this.httpClient.get<QueryListResponse<Tool>>(`/api/tools?searchTerms=${term}`);
                } else {
                    return of(null);
                }
            })
        );
    }

    getAttachments(entity: Tool): Observable<EntityAttachment[]> {
        throw new Error('Method not implemented.');
    }

    createAttachments(tool: Tool, attachments: EntityAttachment[]): Observable<EntityAttachment[]> {
        return this.httpClient.post<EntityAttachment[]>(`/api/tools/${tool._id}/attachments`, attachments);
    }

    removeAttachment(entity: Tool, attachment: EntityAttachment): Observable<EntityAttachment> {
        throw new Error('Method not implemented.');
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
