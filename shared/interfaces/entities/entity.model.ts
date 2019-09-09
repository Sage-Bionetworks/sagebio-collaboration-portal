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
