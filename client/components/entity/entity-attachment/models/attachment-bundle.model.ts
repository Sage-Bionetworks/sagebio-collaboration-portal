import { EntityAttachment } from 'models/entities/entity-attachment.model';
import { Entity } from 'models/entities/entity.model';

export interface AttachmentBundle {
    attachment: EntityAttachment;
    entity: Entity;
}
