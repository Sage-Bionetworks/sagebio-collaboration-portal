import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';

import { TokenService } from '../auth/token.service';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    static parameters = [TokenService];
    constructor(private tokenService: TokenService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.url.startsWith('/')) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.tokenService.get()}`
                }
            });
        }
        return next.handle(request);
    }
}
