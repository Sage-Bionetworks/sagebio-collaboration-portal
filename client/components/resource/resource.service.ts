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
import { stringifyQuery } from 'components/util';
import { Project } from 'models/entities/project.model';
import { Resource } from 'models/entities/resources/resource.model';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';
import { ActivitySidenavComponent } from 'components/activity/activity-sidenav/activity-sidenav.component';
import { EntityService } from 'components/entity/entity.service';

@Injectable()
export class ResourceService implements EntityService<Resource> {

    static parameters = [HttpClient, SecondarySidenavService];
    constructor(private httpClient: HttpClient,
        private secondarySidenavService: SecondarySidenavService) { }

    query(project: Project, query?: {}): Observable<Resource[]> {
        return this.httpClient.get<Resource[]>(`/api/resources/entity/${project._id}${stringifyQuery(query)}`);
    }

    getAll(query?: {}): Observable<Resource[]> {
        return this.httpClient.get<Resource[]>(`/api/resources${stringifyQuery(query)}`);
    }

    getResource(resourceId: string): Observable<Resource> {
        return this.httpClient.get<Resource>(`/api/resources/${resourceId}`);
    }

    create(resource: Resource): Observable<Resource> {
        return this.httpClient.post<Resource>('/api/resources', resource);
    }

    updateResourceDescription(resource: Resource, description: string): Observable<Resource> {
        return this.httpClient.patch<Resource>(`/api/resources/${resource._id}`,  // HACK
            [
                { op: 'replace', path: '/description', value: description }
            ]
        );
    }

    updateStateDescription(resource: Resource, description: string): Observable<Resource> {
        return this.httpClient.patch<Resource>(`/api/states/${resource._id}`,  // HACK
            [
                { op: 'replace', path: '/description', value: description }
            ]
        );
    }

    showActivity(resource: Resource): void {
        let sidenavContentId = `activity:${resource._id}`;
        if (this.secondarySidenavService.getContentId() !== sidenavContentId) {
            (<ActivitySidenavComponent>this.secondarySidenavService
                .loadContentComponent(ActivitySidenavComponent))
                .setRoot(resource);
            this.secondarySidenavService.setContentId(sidenavContentId);
        }
        this.secondarySidenavService.open();
    }

    makePublic(entity: Resource): Observable<Resource> {
        throw new Error('Method not implemented.');
    }
    makePrivate(entity: Resource): Observable<Resource> {
        throw new Error('Method not implemented.');
    }
}
