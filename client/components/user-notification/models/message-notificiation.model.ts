import { UserProfile } from 'models/auth/user-profile.model';

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
export interface MessageNotification {
  _id?: string;
  notificationType: string;
  userId: UserProfile | string;
  access: string;
  archived: boolean;
  createdAt: string;
  createdBy: UserProfile | string;
  messageBody: string;
}
