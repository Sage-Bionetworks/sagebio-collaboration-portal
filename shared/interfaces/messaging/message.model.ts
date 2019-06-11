import { UserProfile } from '../user-profile.model';

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         thread:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         createdBy:
 *           $ref: '#/components/schemas/UserProfile'
 */
export interface Message {
    _id?: string;
    body: string;
    thread?: string;
    createdAt: string;
    updatedAt: string;
    createdBy: UserProfile;
}
