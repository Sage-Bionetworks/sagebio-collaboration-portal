import { EntityAttachment } from 'models/entities/entity-attachment.model';

export interface AttachmentUpdateResult {
    added: EntityAttachment[];
    removed: EntityAttachment[];
}
