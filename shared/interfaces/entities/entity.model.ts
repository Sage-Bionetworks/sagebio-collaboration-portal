import { UserProfile } from '../auth/user-profile.model';
import { InsightAttachment } from './insights/insight.model';
import { ResourceAttachment } from './resources/resource.model';

export interface Entity {
    _id?: string;
    title: string;
    description: string;
    picture: string;
    visibility: EntityVisibility;
    createdAt: string;
    createdBy: UserProfile;
    attachments?: EntityAttachments;
}

// WIP Front-end EntityAttachments interface
export interface EntityAttachments {
    insights?: InsightAttachment[];
    resources?: ResourceAttachment[];
}

export enum EntityAttachmentKeys {
    INSIGHT = 'Insight',
    RESOURCE = 'Resource',
}

export enum EntityAttachmentMode {
    EDIT = 'Edit',
    DISPLAY = 'Display',
}

/**
 * @swagger
 * components:
 *   schemas:
 *     EntityVisibility:
 *       type: string
 *       enum:
 *         - Public
 *         - Private
 */
export enum EntityVisibility {
    PUBLIC = 'Public',
    PRIVATE = 'Private'
}
