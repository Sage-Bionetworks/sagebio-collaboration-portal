import { UserProfile } from '../auth/user-profile.model';

/**`
 * @swagger
 * components:
 *   schemas:
 *     MessageNotification:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 */

export interface UserNotification {
  _id?: string;
  notificationType: string;
  userId: UserProfile | string;
  access: string;
  archived: boolean;
  createdAt: string;
  createdBy: UserProfile | string;
}