import { UserProfile } from './user-profile.model';

/**
 * @swagger
 * components:
 *   schemas:
 *     EntityPermission:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 */
export interface EntityPermission {
    _id?: string;
    entityId: string;
    entityType: string;
    user: UserProfile | string;
    access: string;
    createdAt?: string;
    createdBy?: UserProfile;
}
