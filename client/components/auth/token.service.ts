import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable()
export class TokenService {

    public get(): string {
        return localStorage.getItem('access_token');
    }

    public set(token: string, expiresIn: number): void {
        localStorage.setItem('access_token', token);
        const expiresAt = moment().add(expiresIn, 'second');
        localStorage.setItem('access_token_expires_at', JSON.stringify(expiresAt.valueOf()));
    }

    public deleteToken(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('access_token_expires_at');
    }

    public isTokenExpired(): boolean {
        return moment().isAfter(this.getExpiration());
    }

    public getExpiration(): moment.Moment {
        const expiration = localStorage.getItem('access_token_expires_at');
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
    }
}
