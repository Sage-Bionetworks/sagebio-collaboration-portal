import { UserProfile, } from 'models/auth/user-profile.model';
import { EntityPermission } from 'models/auth/entity-permission.model'

/**`
 * @swagger
 * components:
 *   schemas:
 *     EntityAccessNotification:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 */

export interface EntityAccessNotification {
  _id?: string;
  notificationType: string;
  userId: UserProfile | string;
  access: string;
  archived: boolean;
  createdAt: string;
  createdBy: UserProfile | string;
  entityId: string;
  entityType: string;
  entityPermissionId: EntityPermission | string;
}