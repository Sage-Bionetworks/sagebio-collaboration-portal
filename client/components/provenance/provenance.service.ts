import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable()
export class ProvenanceService {

    static parameters = [HttpClient];
    constructor(private httpClient: HttpClient) { }

    createProvenanceActivity(body): Observable<any> {
        // console.log(`createProvenanceActivity body: ${JSON.stringify(body, null, 2)}`);
        return this.httpClient.post<any>(`/api/provenance`, body);
    }

    createActivitiesBatch(body): Observable<any> {
        return this.httpClient.post<any>(`/api/provenance/batch`, body);
    }

    getProvenanceGraph(sortBy: string, order: string, limit: number): Observable<any> {
        let params = new HttpParams()
            .set('sortBy', sortBy)
            .set('order', order)
            .set('limit', String(limit));
        return this.httpClient.get<any>(`/api/provenance`, {params});
    }

    getProvenanceGraphByAgent(agentId: string, sortBy: string, order: string, limit: number): Observable<any> {
        let params = new HttpParams()
            .set('sortBy', sortBy)
            .set('order', order)
            .set('limit', String(limit));
        return this.httpClient.get<any>(`/api/provenance/byAgent/${agentId}`, {params});
    }

    getProvenanceGraphByReference(referenceId: string, direction: string, sortBy: string, order: string, limit: number): Observable<any> {
        let params = new HttpParams()
            .set('direction', direction)
            .set('sortBy', sortBy)
            .set('order', order)
            .set('limit', String(limit));
        return this.httpClient.get<any>(`/api/provenance/byReference/${referenceId}`, {params});
    }
}
