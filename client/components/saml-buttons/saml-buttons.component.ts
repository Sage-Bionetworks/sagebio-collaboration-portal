import { Component } from '@angular/core';

@Component({
    selector: 'saml-buttons',
    template: require('./saml-buttons.html'),
    styles: [require('./saml-buttons.scss')],
})
export class SAMLButtonsComponent {
    loginSaml(provider) {
        window.location.href = `/auth/${provider}`;
    }
}
