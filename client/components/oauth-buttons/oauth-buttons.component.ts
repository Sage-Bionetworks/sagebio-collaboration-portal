import { Component } from '@angular/core';

@Component({
    selector: 'oauth-buttons',
    template: require('./oauth-buttons.html'),
    styles: [require('./oauth-buttons.scss')],
})
export class OAuthButtonsComponent {
    loginOauth(provider) {
        window.location.href = `/auth/${provider}`;
    }
}
