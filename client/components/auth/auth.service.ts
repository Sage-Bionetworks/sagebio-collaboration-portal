import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { UserService, TokenResponse } from './user.service';
import { TokenService } from './token.service';
import { User } from '../../../shared/interfaces/user.model';

class AuthInfo {

  constructor(public user: User) { }

  isLoggedIn() {
    return !!(this.user && this.user._id);
  }

  isAdmin(): boolean {
    return this.user && this.user.role === 'admin';
  }
}

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
  }

  /**
   * Updates and returns the authentification information.
   * @return {Observable<AuthInfo>}
   */
  getAuthInfo(): Observable<AuthInfo> {
    if (this.tokenService.get()) {
      return this.userService.get()
        .pipe(
          map(user => {
            this.setUser(user);
            return this._authInfo.getValue();
          }),
          catchError(err => {
            this.tokenService.deleteToken();
            this.setUser(AuthService.UNKNOWN_USER);
            return this._authInfo.asObservable();
          })
        );
    } else {
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
      mergeMap(res => {
        this.tokenService.set(res.token, res.expiresIn);
        return this.userService.get();
      }),
      map(user => {
        this.setUser(user);
        return user;
      }),
      catchError(err => {
        this.logout();
        return throwError(err);
      })
      );
  }

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
    // return this._authInfo;
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
