import { Component, Input } from '@angular/core';

@Component({
    selector: 'sso-buttons',
    template: require('./sso-buttons.html'),
    styles: [require('./sso-buttons.scss')],
})
export class SSOButtonsComponent {
    @Input() private authStrategies: string[] = [];

    login(provider: string): void {
        window.location.href = `/auth/${provider}`;
    }
}
