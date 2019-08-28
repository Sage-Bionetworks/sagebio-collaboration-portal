import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    map,
    switchMap
} from 'rxjs/operators';
import { User } from 'models/auth/user.model';
import { UserProfile } from 'models/auth/user-profile.model';
import { TokenResponse } from 'models/auth/token-response.model';

@Injectable()
export class UserService {
    static parameters = [HttpClient];
    constructor(private httpClient: HttpClient) { }

    query(): Observable<UserProfile[]> {
        return this.httpClient.get<UserProfile[]>('/api/users/');
    }

    get(userId = 'me'): Observable<User> {
        return this.httpClient.get<User>(`/api/users/${userId}`);
    }

    create(user: User): Observable<TokenResponse> {
        return this.httpClient.post<TokenResponse>('/api/users/', user);
    }

    changePassword(userId: string, oldPassword: string, newPassword: string): Observable<User> {
        return this.httpClient.put<User>(`/api/users/${userId}/password`, { oldPassword, newPassword });
    }

    remove(user: UserProfile): Observable<UserProfile> {
        return this.httpClient.delete(`/api/users/${user._id}`)
            .pipe(
                map(() => user)
            );
    }

    changeRole(userId: String, newRole: String): Observable<User> {
        return this.httpClient.put<User>(`/api/users/${userId}/role`, { newRole });
    }

    searchUserByUsername(terms: Observable<string>): Observable<UserProfile[] | null> {
        return terms
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(term => {
                    if (term) {
                        return this.httpClient.get<UserProfile[]>(`/api/users?username=${term}`);
                    } else {
                        return of(null);
                    }
                })
            );
    }

    updateUser(patches: Object[], userId: String): Observable<User> {
        return this.httpClient.patch<User>(`/api/users/${userId}`, patches);
    }
}
