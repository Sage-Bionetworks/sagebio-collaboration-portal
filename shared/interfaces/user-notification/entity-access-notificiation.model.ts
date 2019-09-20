import { EntityNotification } from './entity-notificiation.model';
import { EntityPermission } from '../auth/entity-permission.model';
import { UserNotification } from './user-notification.model';

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
export interface EntityAccessUserNotification extends UserNotification {
    entityPermissionId: EntityPermission | string;
}
