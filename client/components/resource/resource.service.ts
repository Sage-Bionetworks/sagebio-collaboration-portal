import { QueryListResponse } from './../../../shared/interfaces/query-list-response.model';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { stringifyQuery } from 'components/util';
import { Project } from 'models/entities/project.model';
import { Resource } from 'models/entities/resources/resource.model';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';
import { ActivitySidenavComponent } from 'components/activity/activity-sidenav/activity-sidenav.component';
import { EntityService } from 'components/entity/entity.service';
import { Patch } from 'models/patch.model';

@Injectable()
export class ResourceService implements EntityService<Resource> {
    static parameters = [HttpClient, SecondarySidenavService];
    constructor(private httpClient: HttpClient, private secondarySidenavService: SecondarySidenavService) {}

    query(query?: {}): Observable<QueryListResponse<Resource>> {
        return this.httpClient.get<QueryListResponse<Resource>>(`/api/resources${stringifyQuery(query)}`);
    }

    get(id: string): Observable<Resource> {
        return this.httpClient.get<Resource>(`/api/resources/${id}`);
    }

    getBySlug(slug: string): Observable<Resource> {
        throw new Error('Method not implemented.');
    }

    create(resource: Resource): Observable<Resource> {
        return this.httpClient.post<Resource>('/api/resources', resource);
    }

    update(id: string, patches: Patch[]): Observable<Resource> {
        return this.httpClient.patch<Resource>(`/api/resources/${id}`, patches);
    }

    remove(resource: Resource): Observable<Resource> {
        return this.httpClient.delete(`/api/resources/${resource._id}`).pipe(map(() => resource));
    }

    makePublic(entity: Resource): Observable<Resource> {
        throw new Error('Method not implemented.');
    }

    makePrivate(entity: Resource): Observable<Resource> {
        throw new Error('Method not implemented.');
    }

    searchByTerms(terms: Observable<string>): Observable<Resource[] | null> {
        return terms.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(term => {
                if (term) {
                    return this.httpClient.get<Resource[]>(`/api/resources?searchTerms=${term}`);
                } else {
                    return of(null);
                }
            })
        );
    }

    // MODEL FUNCTIONS

    getEntitySubType(resource: Resource): string {
        return resource.resourceType;
    }

    getRouterLink(resource: Resource): string[] {
        return ['/projects', resource.projectId, 'resources', resource._id];
    }

    // FUNCTIONS TO REVIEW

    queryByProject(project: Project, query?: {}): Observable<Resource[]> {
        return this.httpClient.get<Resource[]>(`/api/resources/entity/${project._id}${stringifyQuery(query)}`);
    }

    // getResources(query?: {}): Observable<Resource[]> {
    //     return this.httpClient.get<Resource[]>(`/api/resources${stringifyQuery(query)}`);
    // }

    getResource(resourceId: string): Observable<Resource> {
        return this.httpClient.get<Resource>(`/api/resources/${resourceId}`);
    }

    updateResourceDescription(resource: Resource, description: string): Observable<Resource> {
        return this.httpClient.patch<Resource>(
            `/api/resources/${resource._id}`, // HACK
            [{ op: 'replace', path: '/description', value: description }]
        );
    }

    updateStateDescription(resource: Resource, description: string): Observable<Resource> {
        return this.httpClient.patch<Resource>(
            `/api/states/${resource._id}`, // HACK
            [{ op: 'replace', path: '/description', value: description }]
        );
    }

    showActivity(resource: Resource): void {
        let sidenavContentId = `activity:${resource._id}`;
        if (this.secondarySidenavService.getContentId() !== sidenavContentId) {
            (<ActivitySidenavComponent>(
                this.secondarySidenavService.loadContentComponent(ActivitySidenavComponent)
            )).setRoot(resource);
            this.secondarySidenavService.setContentId(sidenavContentId);
        }
        this.secondarySidenavService.open();
    }
}
