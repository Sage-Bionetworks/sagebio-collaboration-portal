import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, pipe, throwError } from 'rxjs';
import { catchError, map, mergeMap, filter, take } from 'rxjs/operators';
import { UserService } from './user.service';
import { TokenService } from './token.service';
import { User } from 'models/auth/user.model';
import { TokenResponse } from 'models/auth/token-response.model';

class AuthInfo {
    constructor(public user: User) { }

    isLoggedIn() {
        return !!(this.user && this.user._id);
    }
}

const _loginWithTokenResponse = (authService: AuthService) => pipe(
    mergeMap((res: TokenResponse) => {
        authService.getTokenService().set(res.token, res.expiresIn);
        return authService.getUserService().get();
    }),
    map(user => {
        authService.setAuthInfo(new AuthInfo(user));
        return user;
    }),
    catchError(err => {
        authService.logout();
        return throwError(err);
    })
);

@Injectable()
export class AuthService {
    private uuid; // TODO: remove

    static UNKNOWN_USER = new AuthInfo(undefined);
    private _authInfo: BehaviorSubject<AuthInfo> = new BehaviorSubject<AuthInfo>(undefined);
    private loginUrl = '/login';
    private redirectUrl = '/';

    static parameters = [HttpClient, UserService, TokenService];
    constructor(private httpClient: HttpClient, private userService: UserService,
        private tokenService: TokenService) {

        console.log('AUTH SERVICE CONSTRUCTOR');
        // this.getAuthInfo();
        // if (!this._authInfo.getValue()) {
            // this.initAuthInfo();
        // }
        this.uuid = Math.floor(Math.random() * 100) + 1;
        console.log('UUID', this.uuid);
    }

    // this.initAuthInfo();

    /**
     * Updates and returns the authentification information.
     *
     * @return {Observable<AuthInfo>}
     */
    // getAuthInfo(): Observable<AuthInfo> {
    //     if (this.tokenService.get()) {
    //         return this.userService.get()
    //             .pipe(
    //                 map(user => {
    //                     this._authInfo.next(new AuthInfo(user));
    //                     return this._authInfo.getValue();
    //                 }),
    //                 catchError(() => {
    //                     this.tokenService.deleteToken();
    //                     this._authInfo.next(AuthService.UNKNOWN_USER);
    //                     return this._authInfo.asObservable();
    //                 })
    //             );
    //     } else {
    //         this.tokenService.deleteToken();
    //         this._authInfo.next(AuthService.UNKNOWN_USER);
    //         return this._authInfo.asObservable();
    //     }
    // }

    initAuthInfo(): void {
        console.log('INIT AUTH INFO -----');
        if (this.tokenService.get()) {
            this.userService.get()
                .pipe(
                    map(user => new AuthInfo(user)),
                    catchError(err => {
                        this.tokenService.deleteToken();
                        return of(AuthService.UNKNOWN_USER);
                    })
                )
                .subscribe(authInfo =>
                    this._authInfo.next(authInfo)
                , err => console.error(err));
        } else {
            this.tokenService.deleteToken();
            this._authInfo.next(AuthService.UNKNOWN_USER);
        }
    }

    /**
     * Authenticates user and save token.
     *
     * @param {Object} credentials Login info
     * @return {Observable<User>}
     */
    login({ email, password }: any): Observable<User> {
        return this.httpClient.post<TokenResponse>('/auth/local', {
            email,
            password
        })
            .pipe(
                _loginWithTokenResponse(this)
            );
    }

    /**
     * Login in using a token response returned by the server.
     */
    loginWithTokenResponse(tokenResponse: TokenResponse): Observable<User> {
        return of(tokenResponse)
            .pipe(
                _loginWithTokenResponse(this)
            );
    }

    /**
     * Deletes access token and user info.
     * @return {Observable}
     */
    logout(): Observable<null> {
        this.tokenService.deleteToken();
        this._authInfo.next(AuthService.UNKNOWN_USER);
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
                    this._authInfo.next(new AuthInfo(createdUser));
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
        return this.userService.changePassword(
            this._authInfo.getValue().user._id,
            oldPassword, newPassword
        );
    }

    /**
     * Returns the authentification information.
     *
     * @return {Observable<AuthInfo>}
     */
    authInfo(): Observable<AuthInfo> {
                if (!this._authInfo.getValue()) {
            this.initAuthInfo();
        }
        return this._authInfo
            .pipe(
                filter(authInfo => !!authInfo)
            );
    }

    /**
     * Returns the current authentification information value.
     */
    // authInfoValue(): AuthInfo {
    //     return this._authInfo.getValue();
    // }

    /**
     * Gets auth token.
     *
     * @return {string} A token string used for authenticating
     */
    getToken(): string {
        return this.tokenService.get();
    }

    getAuthStrategies(): Observable<string[]> {
        return this.httpClient.get<string[]>('/auth/strategies');
    }

    getLoginUrl(): string {
        return this.loginUrl;
    }

    getRedirectUrl(): string {
        return this.redirectUrl;
    }
    setRedirectUrl(url: string): void {
        this.redirectUrl = url;
    }

    resetRedirectUrl(): void {
        this.redirectUrl = '/';
    }

    //
    // HELPER FUNCTIONS
    //

    getTokenService(): TokenService {  // Used by loginWithTokenResponse
        return this.tokenService;
    }

    getUserService(): UserService {  // Used by loginWithTokenResponse
        return this.userService;
    }

    setAuthInfo(authInfo: AuthInfo): void {  // Used by loginWithTokenResponse
        this._authInfo.next(authInfo);
    }
}
