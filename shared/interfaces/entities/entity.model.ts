import { UserProfile } from '../auth/user-profile.model';

export interface Entity {
    _id?: string;
    title: string;
    description: string;
    picture: string;
    visibility: EntityVisibility;
    createdAt: string;
    createdBy: UserProfile;
}

export interface EntityAttachment {
    _id?: string;
    model: string;
    source?: string;
    name?: string;
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
