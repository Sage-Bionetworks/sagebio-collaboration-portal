import { EntityVisibility } from './attachments/entity-visibility.enum';
import { UserProfile } from '../auth/user-profile.model';
import { EntityAttachments } from './attachments/entity-attachments.interface';

export interface Entity {
    _id?: string;
    title: string;
    description: string;
    picture: string;
    visibility?: EntityVisibility;
    createdAt: string;
    createdBy: UserProfile;
    attachments?: EntityAttachments;
}

// Interfaces
export { EntityAttachments } from './attachments/entity-attachments.interface';

// Enums
export { EntityAttachmentKeys } from './attachments/entity-attachment-keys.enum';
export { EntityAttachmentMode } from './attachments/entity-attachment-mode.enum';
export { EntityVisibility } from './attachments/entity-visibility.enum';
