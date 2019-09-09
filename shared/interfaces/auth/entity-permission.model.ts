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
 *         property:
 *           type: string
 *         entityType:
 *           type: string
 *         user:
 *           type: string
 *         access:
 *           $ref: '#/components/schemas/EntityAccess'
 *         status:
 *           $ref: '#/components/schemas/EntityAccessStatus'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         createdBy:
 *           $ref: '#/components/schemas/User'
 */
export interface EntityPermission {
    _id?: string;
    entityId: string;
    entityType: string;
    user: UserProfile | string;
    access: EntityAccess | string;
    status?: EntityAccessStatus | string;
    createdAt?: string;
    createdBy?: UserProfile | string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     EntityAccess:
 *       type: string
 *       enum:
 *         - Read
 *         - Write
 *         - Admin
 */
export enum EntityAccess {
    READ = 'Read',
    WRITE = 'Write',
    ADMIN = 'Admin'
}

/**
 * @swagger
 * components:
 *   schemas:
 *     EntityAccessStatus:
 *       type: string
 *       enum:
 *         - Pending
 *         - Accepted
 *         - Declined
 */
export enum EntityAccessStatus {
    PENDING = 'Pending',
    ACCEPTED = 'Accepted',
    DECLINED = 'Declined'
}
