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
import { State } from '../../../shared/interfaces/state.model';
import { stringifyQuery } from '../../components/util';
import { some, orderBy } from 'lodash/fp';


@Injectable()
export class StateService {

    static parameters = [HttpClient];
    constructor(private httpClient: HttpClient) { }

    getStates(query?: {}): Observable<State[]> {
        return this.httpClient.get<State[]>(`/api/states${stringifyQuery(query)}`);
    }

    getState(stateId: string): Observable<State> {
        return this.httpClient.get<State>(`/api/states/${stateId}`);
    }
}
