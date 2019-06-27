import { Component } from '@angular/core';

@Component({
    selector: 'sso-buttons',
    template: require('./sso-buttons.html'),
    styles: [require('./sso-buttons.scss')],
})
export class SSOButtonsComponent {
    login(provider) {
        window.location.href = `/auth/${provider}`;
    }
}
