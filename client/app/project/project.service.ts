import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Project } from 'models/entities/project.model';
import { Patch } from 'models/patch.model';
import { stringifyQuery } from 'components/util';
import { some, orderBy, head } from 'lodash/fp';
import { EntityVisibility, Entity } from 'models/entities/entity.model';
import { EntityService } from 'components/entity/entity.service';
import { QueryListResponse } from 'models/query-list-response.model';

@Injectable()
export class ProjectService implements EntityService<Project> {
    static parameters = [HttpClient];
    constructor(private httpClient: HttpClient) {}

    query(query?: {}): Observable<QueryListResponse<Project>> {
        return this.httpClient.get<QueryListResponse<Project>>(`/api/projects${stringifyQuery(query)}`);
    }

    get(id: string): Observable<Project> {
        return this.httpClient.get<Project>(`/api/projects/${id}`);
    }

    getBySlug(slug: string): Observable<Project> {
        throw new Error('Method not implemented.');
    }

    create(project: Project): Observable<Project> {
        return this.httpClient.post<Project>('/api/projects', project);
    }

    update(id: string, patches: Patch[]): Observable<Project> {
        return this.httpClient.patch<Project>(`/api/projects/${id}`, patches);
    }

    remove(project: Project): Observable<Project> {
        return this.httpClient.delete(`/api/projects/${project._id}`).pipe(map(() => project));
    }

    makePublic(entity: Project): Observable<Project> {
        return this.httpClient.patch<Project>(`/api/projects/${entity._id}/visibility/public`, []);
    }

    makePrivate(entity: Project): Observable<Project> {
        return this.httpClient.patch<Project>(`/api/projects/${entity._id}/visibility/private`, []);
    }

    // TOD REVIEW

    getVisibility(projectId: string): Observable<EntityVisibility> {
        return this.httpClient.get<EntityVisibility>(`/api/projects/${projectId}/visibility`);
    }
}
