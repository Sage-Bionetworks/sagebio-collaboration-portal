import { UserProfile } from '../auth/user-profile.model';

/**
 * @swagger
 * components:
 *   schemas:
 *     Thread:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         entityId:
 *           type: string
 *         entityType:
 *           type: string
 *         contributors:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserProfile'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         createdBy:
 *           $ref: '#/components/schemas/UserProfile'
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         updatedBy:
 *           $ref: '#/components/schemas/UserProfile'
 */
export interface Thread {
    _id?: string;
    title: string;
    entityId: string;
    entityType: string;
    contributors?: UserProfile[];
    createdAt?: string;
    createdBy?: UserProfile;
    updatedAt?: string;
    updatedBy?: UserProfile;
}
