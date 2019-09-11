import { UserNotification } from './user-notification.model';

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

export interface EntityNotification extends UserNotification {
  entityId: string;
  entityType: string;
  messageBody?: string;
}
