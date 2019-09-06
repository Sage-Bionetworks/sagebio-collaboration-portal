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
 *         notificationType:
 *           type: string
 */

export interface UserNotification {
  _id?: string;
  notificationType: string;
  user: UserProfile | string;
  archived?: boolean;
  createdAt?: string;
  createdBy?: UserProfile | string;
}