import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { InsightService } from 'components/insight/insight.service';
import { PageTitleService } from 'components/page-title/page-title.service';
import { Insight } from 'models/entities/insights/insight.model';
// import config from '../../../app/app.constants';
import { Entity } from 'models/entities/entity.model';
import { EntityService } from 'components/entity/entity.service';
import { BehaviorSubject } from 'rxjs';
import { EntityAttachment } from 'models/entities/entity-attachment.model';

@Component({
    selector: 'entity-attachment-list',
    template: require('./entity-attachment-list.html'),
    styles: [require('./entity-attachment-list.scss')],
})
export class EntityAttachmentListComponent<E extends Entity> implements OnInit {
    @Input() entity: E;
    @Input() entityService: EntityService<E>;

    private attachments: BehaviorSubject<EntityAttachment[]> = new BehaviorSubject<EntityAttachment[]>([]);

    static parameters = [];
    constructor() {}

    ngOnInit() {}
}
