import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, pipe, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { UserService } from './user.service';
import { TokenService } from './token.service';
import { User } from '../../../shared/interfaces/user.model';
import { TokenResponse } from '../../../shared/interfaces/token-response.model';

class AuthInfo {

    constructor(public user: User) { }

    isLoggedIn() {
        return !!(this.user && this.user._id);
    }

    isAdmin(): boolean {
        return this.user && this.user.role === 'admin';
    }
}

const loginWithTokenResponse = (authService) => pipe(
    mergeMap((res: TokenResponse) => {
        authService.tokenService.set(res.token, res.expiresIn);
        return authService.userService.get();
    }),
    map(user => {
        authService.setUser(user);
        return user;
    }),
    catchError(err => {
        authService.logout();
        return throwError(err);
    })
);

class AppUser implements User { }

@Injectable()
export class AuthService {
    private uuid; // TODO: remove

    static UNKNOWN_USER = new AuthInfo(null);
    private _authInfo: BehaviorSubject<AuthInfo> = new BehaviorSubject<AuthInfo>(AuthService.UNKNOWN_USER);

    static parameters = [HttpClient, UserService, TokenService];
    constructor(private httpClient: HttpClient, private userService: UserService,
        private tokenService: TokenService) {
        this.getAuthInfo();
        this.uuid = Math.floor(Math.random() * 100) + 1;
        console.log('UUID', this.uuid);
    }

    /**
     * Updates and returns the authentification information.
     * @return {Observable<AuthInfo>}
     */
    getAuthInfo(): Observable<AuthInfo> {
        if (this.tokenService.get()) {
            console.log('HAS TOKEN');
            return this.userService.get()
                .pipe(
                    map(user => {
                        this.setUser(user);
                        return this._authInfo.getValue();
                    }),
                    catchError(() => {
                        this.tokenService.deleteToken();
                        this.setUser(AuthService.UNKNOWN_USER);
                        return this._authInfo.asObservable();
                    })
                );
        } else {
            console.log('HAS NO TOKEN');
            this.tokenService.deleteToken();
            this.setUser(AuthService.UNKNOWN_USER);
            return this._authInfo.asObservable();
        }
    }

    /**
     * Sets the user specified as the current user.
     */
    setUser(user): void {
        this._authInfo.next(new AuthInfo(user));
    }

    /**
     * Authenticates user and save token.
     *
     * @param {Object} credentials Login info
     * @return {Observable<User>}
     */
    login({ email, password }): Observable<User> {
        return this.httpClient.post<TokenResponse>('/auth/local', {
            email,
            password
        })
            .pipe(
                loginWithTokenResponse(this)
                //     // mergeMap(res => {
                //     //     this.tokenService.set(res.token, res.expiresIn);
                //     //     return this.userService.get();
                //     // }),
                //     // map(user => {
                //     //     this.setUser(user);
                //     //     return user;
                //     // }),
                //     // catchError(err => {
                //     //     this.logout();
                //     //     return throwError(err);
                //     // })
            );
    }

    loginWithTokenResponse(tokenResponse: TokenResponse): Observable<User> {
        return of(tokenResponse)
            .pipe(
                loginWithTokenResponse(this)
            );
    }

    // loginWithTokenResponse() {
    //     pipe(
    //         mergeMap((res: TokenResponse) => {
    //             this.tokenService.set(res.token, res.expiresIn);
    //             return this.userService.get();
    //         }),
    //         map(user => {
    //             this.setUser(user);
    //             return user;
    //         }),
    //         catchError(err => {
    //             this.logout();
    //             return throwError(err);
    //         })
    //     );
    // }

    // loginWithTokenResponse(tokenResponse: Observable<TokenResponse>): Observable<User> {
    //     return tokenResponse
    //         .pipe(
    //             mergeMap(res => {
    //                 this.tokenService.set(res.token, res.expiresIn);
    //                 return this.userService.get();
    //             }),
    //             map(user => {
    //                 this.setUser(user);
    //                 return user;
    //             }),
    //             catchError(err => {
    //                 this.logout();
    //                 return throwError(err);
    //             })
    //         );
    // }

    /**
     * Deletes access token and user info.
     * @return {Observable}
     */
    logout(): Observable<null> {
        this.tokenService.deleteToken();
        this.setUser(AuthService.UNKNOWN_USER);
        return of(null);
    }

    /**
     * Creates a new user.
     * @param {Object} user User info
     * @return {Observable<User>}
     */
    createUser(user): Observable<User> {
        return this.userService.create(user)
            .pipe(
                mergeMap((res: TokenResponse) => {
                    this.tokenService.set(res.token, res.expiresIn);
                    return this.userService.get();
                }),
                map(createdUser => {
                    this.setUser(createdUser);
                    return createdUser;
                }),
                catchError(err => {
                    this.logout();
                    return throwError(err);
                })
            );
    }

    /**
     * Changes password.
     * @param {String} oldPassword
     * @param {String} newPassword
     * @return {Observable<User>}
     */
    changePassword(oldPassword, newPassword): Observable<User> {
        return this.userService.changePassword({ id: this._authInfo.getValue().user._id }, oldPassword, newPassword);
    }

    /**
     * Returns the authentification information.
     * @return {Observable<AuthInfo>}
     */
    authInfo(): Observable<AuthInfo> {
        return this._authInfo.asObservable();
    }

    /**
     * Returns the current authentification information value.
     */
    authInfoValue(): AuthInfo {
        return this._authInfo.getValue();
    }

    /**
     * Gets auth token.
     * @return {string} A token string used for authenticating
     */
    getToken(): string {
        return this.tokenService.get();
    }
}
