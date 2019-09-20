import { UserNotification } from './user-notification.model';

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
export interface MessageUserNotification extends UserNotification {
    message: string;
}
