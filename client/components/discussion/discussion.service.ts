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
import { Article } from '../../../shared/interfaces/article.model';
import { stringifyQuery } from '../../components/util';
import { some, orderBy, head } from 'lodash/fp';

@Injectable()
export class DiscussionService {

    static parameters = [HttpClient];
    constructor(private httpClient: HttpClient) { }

    getArticles(query?: {}): Observable<Article[]> {
        return this.httpClient.get<Article[]>(`/api/articles${stringifyQuery(query)}`);
    }
}
