import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
    static parameters = [Router, AuthService];
    constructor(private router: Router, private authService: AuthService) { }

    /**
     * Returns true if the user is authenticated.
     */
    canActivate(): Observable<boolean> | boolean {
        // get the most recent value BehaviorSubject holds
        if (this.authService.authInfoValue().isLoggedIn()) {
            return true;
        }

        // User is not logged in as stored isLoggedIn() indicates,
        // but in case the page has been reloaded, the stored value is lost,
        // and in order to get real auth status we will perform the server call.
        return this.authService.getAuthInfo()
            .pipe(
                map(authInfo => {
                    const isLoggedIn = authInfo.isLoggedIn();
                    if (!isLoggedIn) {
                        this.router.navigate(['/login']);
                    }
                    return isLoggedIn;
                }),
                catchError(err => {
                    console.log(err);
                    return of(false);
                })
            );
    }
}
