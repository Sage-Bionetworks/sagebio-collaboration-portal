import { UserProfile } from 'models/auth/user-profile.model';

/**`
 * @swagger
 * components:
 *   schemas:
 *     EntityNotification:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 */

export interface EntityNotification {
  _id?: string;
  notificationType: string;
  userId: UserProfile;
  access: string;
  archived: boolean;
  createdAt: string;
  createdBy: UserProfile;
  entityId: string;
  entityType: string;
}
