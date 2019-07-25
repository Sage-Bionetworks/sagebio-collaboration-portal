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

    updateUser(patches: Object[], userId: String): Observable<User> { // WIP #170 - Client-side call to PATCH user data
        return this.httpClient.patch<User>(`/api/users/${userId}`, patches);
    }

    /**
     * Returns a pre-signed URL to upload a temporary user face.
     * @param user The user whom face is being updated
     */
    // getFaceSourceUploadUrl(user: User = { _id: 'me' }): Observable<PreSignedPostURL> {
    //   return this.httpClient.get<PreSignedPostURL>(`/api/users/${user.id || user._id}/face-source-s3-presigned-post-url`);
    // }

    /**
     * Returns a pre-signed URL to upload the new face.
     * @param user The user whose face is being updated
     */
    // getFaceUploadUrl(user: User = { _id: 'me' }): Observable<PreSignedPostURL> {
    //   return this.httpClient.get<PreSignedPostURL>(`/api/users/${user.id || user._id}/face-s3-presigned-post-url`);
    // }

    /**
     * Uploads the file specified to the object storage.
     * @param uploadUrl URL
     * @param file File to upload
     */
    // pushFileToStorage(uploadUrl: PreSignedPostURL, file: File): Observable<HttpEvent<{}>> {
    //   const headers = new HttpHeaders({
    //     'enctype': 'multipart/form-data'
    //   });
    //   const form = new FormData();
    //   const { fields, url } = uploadUrl;
    //   for (let field of Object.keys(fields)) {
    //     form.append(field, fields[field]);
    //   }
    //   form.append('Content-Type', file.type);
    //   form.append('file', file);
    //
    //   const req = new HttpRequest('POST', url, form, {
    //     headers: headers,
    //     reportProgress: true,
    //     responseType: 'json'
    //   });
    //   return this.httpClient.request(req);
    // }

    // /**
    //  * Uploads an image to the object storage.
    //  * @return {string} URL of the file in object storage
    //  */
    // uploadFaceTmp(file: File, user: User = { _id: 'me' }): Observable<HttpEvent<{}>> {
    //   return this.httpClient.get<PreSignedPostURL>(`/api/users/${user.id || user._id}/s3-presigned-post-url-face-tmp`)
    //     .pipe(
    //       tap(res => console.log('PRE SIGNED URL', res)),
    //       switchMap(uploadUrl => this.pushFileToStorage(uploadUrl, file))
    //       // catchError(err => of(`Bad Promise: ${err}`))
    //     );
    // }
}
