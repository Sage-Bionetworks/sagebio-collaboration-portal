import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { App } from 'models/entities/app.model';

@Injectable()
export class AppService {

    static parameters = [HttpClient];
    constructor(private httpClient: HttpClient) { }

    getApp(): Observable<App> {
        return this.httpClient.get<App>('/api/apps');
    }
}
