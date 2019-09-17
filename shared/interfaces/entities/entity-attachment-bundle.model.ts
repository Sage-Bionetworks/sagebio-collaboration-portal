import { EntityAttachment } from './entity-attachment.model';
import { EntityPreview } from './entity-preview.model';

export interface EntityAttachmentBundle {
    entityAttachment: EntityAttachment;
    entityPreview: EntityPreview;
}
