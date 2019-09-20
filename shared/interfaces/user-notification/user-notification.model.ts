import { UserProfile } from '../auth/user-profile.model';

/**`
 * @swagger
 * components:
 *   schemas:
 *     UserNotification:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/UserProfile'
 *         archived:
 *           type: boolean
 *         notificationType:
 *           type: string
 *         createdAt:
 *           type: string
 *         createdBy:
 *           $ref: '#/components/schemas/UserProfile'
 */
export interface UserNotification {
    _id?: string;
    user: UserProfile | string;
    archived?: boolean;
    notificationType: string;
    createdAt?: string;
    createdBy?: UserProfile;
}
