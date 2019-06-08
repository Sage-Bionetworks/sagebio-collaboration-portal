import { Component, Input } from '@angular/core';
import { UserProfile } from '../../../shared/interfaces/user-profile.model';

@Component({
    selector: 'user-avatar',
    template: require('./user-avatar.html'),
    styles: [require('./user-avatar.scss')]
})
export class UserAvatarComponent {
    @Input() user: UserProfile;
    @Input() size = 40;

    static parameters = [];
    constructor() { }

    getStyle(): {} {
        return {
            'width': `${this.size}px`,
            'min-width': `${this.size}px`,
            'height': `${this.size}px`,
            'margin': '0 0 0 0',
            'border-radius': '50%'
      };
    }
}
