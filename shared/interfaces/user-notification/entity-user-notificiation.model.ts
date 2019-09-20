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
export interface EntityUserNotification extends UserNotification {
    entityId: string;
    entityType: string;
    message?: string;
}
