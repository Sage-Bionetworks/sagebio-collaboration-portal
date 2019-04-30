import { User } from './user.model';

/**
 * @swagger
 * components:
 *   schemas:
 *     Organization:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         website:
 *           type: string
 *         picture:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         createdBy:
 *           $ref: '#/components/schemas/User'
 */
export interface Organization {
    _id?: string;
    name: string;
    website: string;
    picture: string;
    createdAt: string;
    createdBy: User;
}
