import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
    static parameters = [Router, AuthService];
    constructor(private router: Router, private authService: AuthService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Observable<boolean> | boolean {

        return this.authService.authInfo()
            .pipe(
                map(authInfo => {
                    const isLoggedIn = authInfo.isLoggedIn();
                    if (!isLoggedIn) {
                        this.authService.setRedirectUrl(state.url);
                        this.router.navigate([this.authService.getLoginUrl()]);
                    }
                    return isLoggedIn;
                }),
                catchError(err => {
                    console.error(err);
                    return of(false);
                })
            );
    }
}
