import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable()
export class ProvenanceService {

    static parameters = [HttpClient];
    constructor(private httpClient: HttpClient) { }

    getProvenanceGraph(): Observable<any> {
        return this.httpClient.get<any>(`/api/provenance`);
    }
}
