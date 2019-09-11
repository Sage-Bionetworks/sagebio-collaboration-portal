import { EntityNotification } from './entity-notificiation.model';
import { EntityPermission } from '../auth/entity-permission.model'

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

export interface EntityAccessNotification extends EntityNotification {
  entityPermissionId: EntityPermission | string;
}