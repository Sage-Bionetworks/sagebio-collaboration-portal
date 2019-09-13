import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { stringifyQuery } from 'components/util';
// import { EntityAttachments } from 'models/entities/entity.model';
import { Project } from 'models/entities/project.model';
import { Insight } from 'models/entities/insights/insight.model';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';
import { ActivitySidenavComponent } from 'components/activity/activity-sidenav/activity-sidenav.component';
import { EntityService } from 'components/entity/entity.service';
import { QueryListResponse } from 'models/query-list-response.model';
import { ShareSidenavComponent } from 'components/share/share-sidenav/share-sidenav.component';
import { Entity } from 'models/entities/entity.model';
import { Patch } from 'models/patch.model';

@Injectable()
export class InsightService implements EntityService<Insight> {
    static parameters = [HttpClient, SecondarySidenavService];
    constructor(private httpClient: HttpClient, private secondarySidenavService: SecondarySidenavService) {}

    query(query?: {}): Observable<QueryListResponse<Insight>> {
        return this.httpClient.get<QueryListResponse<Insight>>(`/api/insights${stringifyQuery(query)}`);
    }

    get(id: string): Observable<Insight> {
        return this.httpClient.get<Insight>(`/api/insights/${id}`);
    }

    getBySlug(slug: string): Observable<Insight> {
        throw new Error('Method not implemented.');
    }

    create(insight: Insight): Observable<Insight> {
        return this.httpClient.post<Insight>('/api/insights', insight);
    }

    update(id: string, patches: Patch[]): Observable<Insight> {
        return this.httpClient.patch<Insight>(`/api/insights/${id}`, patches);
    }

    remove(insight: Insight): Observable<Insight> {
        return this.httpClient.delete(`/api/insights/${insight._id}`).pipe(map(() => insight));
    }

    makePublic(entity: Insight): Observable<Insight> {
        throw new Error('Method not implemented.');
    }

    makePrivate(entity: Insight): Observable<Insight> {
        throw new Error('Method not implemented.');
    }

    searchByTerms(terms: Observable<string>): Observable<QueryListResponse<Insight>> {
        return terms.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(term => {
                if (term) {
                    return this.httpClient.get<QueryListResponse<Insight>>(`/api/insights?searchTerms=${term}`);
                } else {
                    return of(null);
                }
            })
        );
    }

    // MODEL FUNCTIONS

    getEntitySubType(insight: Insight): string {
        return insight.insightType;
    }

    getRouterLink(insight: Insight): string[] {
        return ['/projects', insight.projectId, 'insights', insight._id];
    }

    // FUNCTIONS TO REVIEW

    queryByProject(project: Project, query?: {}): Observable<Insight[]> {
        return this.httpClient.get<Insight[]>(`/api/insights/entity/${project._id}${stringifyQuery(query)}`);
    }

    getAll(query?: {}): Observable<Insight[]> {
        return this.httpClient.get<Insight[]>(`/api/insights${stringifyQuery(query)}`);
    }

    getInsight(insightId: string): Observable<Insight> {
        return this.httpClient.get<Insight>(`/api/insights/${insightId}`);
    }

    // updateInsightAttachments(insight: Insight, attachments: EntityAttachments[]): Observable<Insight> {
    //     return this.httpClient.patch<Insight>(`/api/insights/${insight._id}`,  // HACK
    //         [
    //             { op: 'replace', path: '/attachments', value: attachments }
    //         ]
    //     );
    // }

    updateInsightDescription(insight: Insight, description: string): Observable<Insight> {
        return this.httpClient.patch<Insight>(
            `/api/insights/${insight._id}`, // HACK
            [{ op: 'replace', path: '/description', value: description }]
        );
    }

    updateStateDescription(insight: Insight, description: string): Observable<Insight> {
        return this.httpClient.patch<Insight>(
            `/api/states/${insight._id}`, // HACK
            [{ op: 'replace', path: '/description', value: description }]
        );
    }
}
