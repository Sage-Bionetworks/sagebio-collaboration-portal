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
import { Insight } from '../../../shared/interfaces/insight.model';
import { stringifyQuery } from '../../components/util';

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
}
