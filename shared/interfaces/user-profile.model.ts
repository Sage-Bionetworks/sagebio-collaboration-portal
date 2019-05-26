import { User, UserRole } from './user.model';

/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfile:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         username:
 *           type: string
 *         picture:
 *           type: string
 *         role:
 *           $ref: '#/components/schemas/UserRole'
 */
export interface UserProfile {
    _id?: string;
    name: string;
    username: string;
    picture?: string;
    role: UserRole;
}
