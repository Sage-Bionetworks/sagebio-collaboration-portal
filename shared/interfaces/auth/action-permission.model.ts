import { UserProfile } from './user-profile.model';

/**
 * @swagger
 * components:
 *   schemas:
 *     ActionPermission:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *         action:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         createdBy:
 *           $ref: '#/components/schemas/User'
 */
export interface ActionPermission {
    _id?: string;
    user: string;
    action: string;
    createdAt: string;
    createdBy: UserProfile;
}
