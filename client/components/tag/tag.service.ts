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
import { Tag } from '../../../shared/interfaces/tag.model';
import { stringifyQuery } from '../../components/util';
import { some, orderBy, head } from 'lodash/fp';

@Injectable()
export class TagService {

    static parameters = [HttpClient];
    constructor(private httpClient: HttpClient) { }

    getTags(query?: {}): Observable<Tag[]> {
        return this.httpClient.get<Tag[]>(`/api/tags${stringifyQuery(query)}`);
    }
}
