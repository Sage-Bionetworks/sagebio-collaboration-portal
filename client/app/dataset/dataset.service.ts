import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap
} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Dataset } from '../../../shared/interfaces/dataset.model';
import { stringifyQuery } from '../../components/util';

@Injectable()
export class DatasetService {

  static parameters = [HttpClient];
  constructor(private httpClient: HttpClient) { }

  getDatasets(query?: {}): Observable<Dataset[]> {
    return this.httpClient.get<Dataset[]>(`/api/datasets${stringifyQuery(query)}`);
  }

  getGame(datasetId: string): Observable<Dataset> {
    return this.httpClient.get<Dataset>(`/api/datasets/${datasetId}`);
  }

  searchDatasetsByName(terms: Observable<string>): Observable<Dataset[] | null> {
    return terms
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(term => term ? this.getDatasets({searchTerms: term}) : of(null))
      );
  }
}
