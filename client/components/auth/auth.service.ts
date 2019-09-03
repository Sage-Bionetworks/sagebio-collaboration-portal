import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, pipe, throwError } from 'rxjs';
import { catchError, map, mergeMap, filter, take } from 'rxjs/operators';
import { UserService } from './user.service';
import { TokenService } from './token.service';
import { User } from 'models/auth/user.model';
import { TokenResponse } from 'models/auth/token-response.model';
import { AuthInfo } from './auth-info.model';

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
    static GUEST = new AuthInfo(undefined);

    private _authInfo: BehaviorSubject<AuthInfo> = new BehaviorSubject<AuthInfo>(undefined);
    private initStarted = false;

    private loginUrl = '/login';
    private redirectUrl = '/';

    static parameters = [HttpClient, UserService, TokenService];
    constructor(private httpClient: HttpClient, private userService: UserService,
        private tokenService: TokenService) {

        this.uuid = Math.floor(Math.random() * 100) + 1;
        console.log('AUTH SERVICE UUID', this.uuid);
    }

    /**
     * Contacts the token service to check if the user is logged in.
     *
     * Note: For some reason this function generates a near-infinite loop
     * when called from the constructor of this service.
     */
    initAuthInfo(): void {
        this.initStarted = true;
        if (this.tokenService.get()) {
            this.userService.get()
                .pipe(
                    map(user => new AuthInfo(user)),
                    catchError(err => {
                        this.tokenService.deleteToken();
                        return of(AuthService.GUEST);
                    })
                )
                .subscribe(authInfo =>
                    this._authInfo.next(authInfo)
                , err => console.error(err));
        } else {
            this.tokenService.deleteToken();
            this._authInfo.next(AuthService.GUEST);
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
     *
     * @return {Observable}
     */
    logout(): Observable<null> {
        this.tokenService.deleteToken();
        this._authInfo.next(AuthService.GUEST);
        return of(null);
    }

    /**
     * Creates a new user.
     *
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
     *
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
        if (!this._authInfo.getValue() && !this.initStarted) {
            this.initAuthInfo();
        }
        return this._authInfo
            .pipe(
                filter(authInfo => !!authInfo)
            );
    }

    /**
     * Gets authentication token.
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
