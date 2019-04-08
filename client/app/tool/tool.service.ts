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
import { Tool } from '../../../shared/interfaces/tool.model';
import { stringifyQuery } from '../../components/util';
import { ckanApiBaseUrl } from '../app.constants';

@Injectable()
export class ToolService {

    static parameters = [HttpClient];
    constructor(private httpClient: HttpClient) { }

    getTools(query?: {}): Observable<Tool[]> {
        return this.httpClient.get<Tool[]>(`/api/tools${stringifyQuery(query)}`);
    }

    getTool(toolId: string): Observable<Tool> {
        return this.httpClient.get<Tool>(`/api/tools/${toolId}`);
    }

    searchToolsByName(terms: Observable<string>): Observable<Tool[] | null> {
        return terms
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(term => term ? this.getTools({ searchTerms: term }) : of(null))
            );
    }
}
