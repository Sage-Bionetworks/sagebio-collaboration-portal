import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpErrorResponse,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    static parameters = [Router, AuthService];
    constructor(private router: Router, private authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // console.log('Intercepting Request:', request);
        return next.handle(request)
            .pipe(
                tap((event: HttpEvent<any>) => {
                    // console.log('INTERCEPTOR event', event);
                    if (event instanceof HttpResponse) {
                        // do stuff with response if you want
                    }
                }),
                catchError((err: HttpErrorResponse) => {
                    console.log('err', err);
                    if (err.error instanceof Error) {
                        // A client-side or network error occurred. Handle it accordingly.
                        console.error('An error occurred:', err.error.message);
                        // return ErrorObservable.create(err.error);
                        return throwError(err.error);
                    } else {
                        // The backend returned an unsuccessful response code.
                        // The response body may contain clues as to what went wrong
                        console.log('HttpErrorInterceptor', err);
                        if (err.status === 401) { // 401: Unauthorized (but used for authentification error)
                            console.log('INTERCEPTOR 401');
                            // redirect to login if not already logged in
                            // const isLoggedIn = this.authService.authInfoValue().isLoggedIn();
                            // if (!isLoggedIn) {
                            //     console.log('401 SO REDIRECT TO LOGIN');
                            //     // this.router.navigate(['login/']);
                            //     // return ErrorObservable.create(err.error);
                            //     return throwError(err.error);
                            // }
                            // return this.authService.isLoggedIn()
                            // .map(is => {
                            //   if (!is) {
                            //     this.router.navigate(['login/']);
                            //   }
                            //   return ErrorObservable.create(err.error);
                            // });
                            // this.router.navigate(['login/']);
                            // return Observable.throw(err.error);
                        } else if (err.status === 404) {
                            console.log('INTERCEPTOR 404');
                            return throwError({ code: 404, message: 'Not Found' });
                          } else {
                            return throwError({ message: err.error.message || err.error });
                          }
                        // } else if (err.error && err.error.message) {
                        //     // return ErrorObservable.create(err.error);
                        //     console.log('INTERCEPTOR: ONE OF MY ERROR');
                        //     return throwError(err.error);
                        // } else {
                        //     console.log('INTERCEPTOR: DEFAULT ERROR');
                        //     // return ErrorObservable.create({ message: 'Server error' });
                        //     // Observable.throw(new Error('woops')); instead?
                        //     return throwError({ message: 'Server error' });
                        // }
                    }

                    // ...optionally return a default fallback value so app can continue (pick one)
                    // which could be a default value
                    // return Observable.of(new HttpResponse({
                    //   body: [
                    //     { name: "Default values returned by Interceptor", id: 88 },
                    //     { name: "Default values returned by Interceptor(2)", id: 89 }
                    //   ]
                    // }));

                    // or simply an empty observable
                    // return Observable.empty<HttpEvent<any>>();
                })
            );
    }
}
