// @flow
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type UserType = {
    // TODO: use Mongoose model
    id?: string;
    _id?: string;
    name?: string;
    email?: string;
};

@Injectable()
export class UserService {
    static parameters = [HttpClient];
    constructor(private http: HttpClient) {
        this.http = http;
    }

    query(): Observable<UserType[]> {
        return this.http.get('/api/users/') as Observable<UserType[]>;
    }
    get(user: UserType = {id: 'me'}): Observable<UserType> {
        return this.http.get(`/api/users/${user.id || user._id}`) as Observable<UserType>;
    }
    create(user: UserType) {
        return this.http.post('/api/users/', user);
    }
    changePassword(user, oldPassword, newPassword) {
        return this.http.put(`/api/users/${user.id || user._id}/password`, {oldPassword, newPassword});
    }
    remove(user) {
        return this.http.delete(`/api/users/${user.id || user._id}`)
            .pipe(map(() => user));
    }
}
