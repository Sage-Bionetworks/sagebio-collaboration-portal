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
import { ToolHealth } from '../../../shared/interfaces/tool-health.model';
import { stringifyQuery } from '../../components/util';
import { some, orderBy } from 'lodash/fp';


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
        return this.httpClient.get<ToolHealth>(`${tool.apiServerUrl}/health`);
    }
}
