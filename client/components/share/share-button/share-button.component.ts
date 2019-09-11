import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Entity } from 'models/entities/entity.model';
import { ShareService } from '../share.service';

@Component({
    selector: 'share-button',
    template: require('./share-button.html'),
    styles: [require('./share-button.scss')],
    encapsulation: ViewEncapsulation.None,
})
export class ShareButtonComponent {
    @Input() private entity: Entity;
    @Input() private entityType: string;

    static parameters = [ShareService];
    constructor(private shareService: ShareService) {}

    share() {
        this.shareService.shareEntity(this.entity, this.entityType);
    }
}
