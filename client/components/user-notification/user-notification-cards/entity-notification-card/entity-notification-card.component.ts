import { Component, Input } from '@angular/core';
import { noop } from 'lodash'

import { EntityNotification } from 'models/user-notification/entity-notificiation.model';
import { UserNotificationCardComponent } from '../user-notification-card.component';

@Component({
    selector: 'entity-notification-card',
    template: require('./entity-notification-card.html'),
    styles: [require('../user-notification-card.scss')]
})
export class EntityNotificationCardComponent extends UserNotificationCardComponent{
    @Input() notification: EntityNotification;

    acceptAndGo() {
        this.goToEntity()
        this.archive().subscribe(noop)
    }
}
