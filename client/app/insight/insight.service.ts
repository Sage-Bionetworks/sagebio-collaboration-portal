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
import { stringifyQuery } from '../../components/util';

import { Insight } from '../../../shared/interfaces/insights/insight.model';
import { State } from '../../../shared/interfaces/insights/state.model';
import { Report } from '../../../shared/interfaces/insights/report.model';
import { Dashboard } from '../../../shared/interfaces/insights/dashboard.model';

@Injectable()
export class InsightService {

    static parameters = [HttpClient];
    constructor(private httpClient: HttpClient) { }

    getInsights(query?: {}): Observable<Insight[]> {
        return this.httpClient.get<Insight[]>(`/api/insights${stringifyQuery(query)}`);
    }







    getInsight(insightId: string): Observable<Insight> {
        return this.httpClient.get<Insight>(`/api/insights/${insightId}`);
    }

    searchInsightsByName(terms: Observable<string>): Observable<Insight[] | null> {
        return terms
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(term => term ? this.getInsights({ searchTerms: term }) : of(null))
            );
    }

    updateInsightDescription(insight: Insight, description: string): Observable<Insight> {
        return this.httpClient.patch<Insight>(`/api/insights/${insight._id}`,  // HACK
            [
                { op: 'replace', path: '/description', value: description }
            ]
        );
    }

    updateStateDescription(insight: Insight, description: string): Observable<Insight> {
        return this.httpClient.patch<Insight>(`/api/states/${insight._id}`,  // HACK
            [
                { op: 'replace', path: '/description', value: description }
            ]
        );
    }
}
