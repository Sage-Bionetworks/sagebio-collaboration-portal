import { UserProfile } from '../auth/user-profile.model';
import { Thread } from './thread.model';

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
 *           type: string | object
 *           $ref: '#/components/schemas/Thread'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         createdBy:
 *           $ref: '#/components/schemas/UserProfile'
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         updatedBy:
 *           $ref: '#/components/schemas/UserProfile'
 */
export interface Message {
    _id?: string;
    body: string | any;
    thread?: Thread | string;
    createdAt?: string;
    createdBy?: UserProfile;
    updatedAt?: string;
    updatedBy?: UserProfile;
}
