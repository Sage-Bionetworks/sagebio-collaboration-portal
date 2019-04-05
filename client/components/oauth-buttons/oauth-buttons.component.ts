import { Component } from '@angular/core';

@Component({
    selector: 'oauth-buttons',
    template: './oauth-buttons.html',
    styles: ['./oauth-buttons.scss'],
})
export class OauthButtonsComponent {
    loginOauth(provider) {
        window.location.href = `/auth/${provider}`;
    }
}
