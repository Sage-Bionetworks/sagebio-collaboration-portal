import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    map,
    switchMap,
    tap,
    catchError
} from 'rxjs/operators';
import { User } from '../../../shared/interfaces/user.model';
import { UserProfile } from '../../../shared/interfaces/user-profile.model';
import { Permission } from '../../../shared/interfaces/permission.model';
import { TokenResponse } from '../../../shared/interfaces/token-response.model';

@Injectable()
export class UserPermissionService {
    static parameters = [HttpClient];
    constructor(private httpClient: HttpClient) { }

    query(): Observable<Permission[]> {
        return this.httpClient.get<Permission[]>('/api/permissions/');
    }

    getMyPermissions(): Observable<Permission[]> {
        return this.httpClient.get<Permission[]>('/api/permissions/mine');
    }
}
