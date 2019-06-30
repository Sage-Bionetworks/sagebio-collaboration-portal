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
import { Project } from '../../../shared/interfaces/project.model';
import { stringifyQuery } from '../../components/util';
import { some, orderBy, head } from 'lodash/fp';

@Injectable()
export class ProjectService {

    static parameters = [HttpClient];
    constructor(private httpClient: HttpClient) { }

    getProjects(query?: {}): Observable<Project[]> {
        return this.httpClient.get<Project[]>(`/api/projects${stringifyQuery(query)}`);
    }

    getProject(projectId: string): Observable<Project> {
        return this.httpClient.get<Project>(`/api/projects/${projectId}`);
    }

    create(project: Project): Observable<Project> {
        return this.httpClient.post<Project>('/api/projects', project);
    }
}
