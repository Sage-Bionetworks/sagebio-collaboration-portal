import { Component, Input } from '@angular/core';
import { EntityNotification } from 'models/user-notification/entity-notificiation.model';
import { Entity } from 'models/entities/entity.model';
import { UserNotificationCardComponent } from '../user-notification-card.component';

@Component({
    selector: 'entity-notification-view',
    template: require('./entity-notification-view.html'),
    styles: [require('../user-notification-card.scss')]
})
export class EntityNotificationViewComponent extends UserNotificationCardComponent{
    @Input() notification: EntityNotification;
}
