import { Message } from './message.model';
import { UserProfile } from '../auth/user-profile.model';

/**
 * @swagger
 * components:
 *   schemas:
 *     StarredMessage:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         message:
 *           type: string
 *         starredBy:
 *           $ref: '#/components/schemas/UserProfile'
 *         archived:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 */
export interface StarredMessage {
    _id?: string;
    message: string;
    starredBy: UserProfile;
    archived: boolean;
    createdAt: string;
}
