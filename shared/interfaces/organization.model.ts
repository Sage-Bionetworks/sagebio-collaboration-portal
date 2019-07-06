import { User } from './auth/user.model';

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
 *         domains:
 *           type: array
 *           items:
 *             type: string
 *         picture:
 *           type: string
 *         active:
 *           type: boolean
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
    domains: string[];
    picture: string;
    active: boolean;
    createdAt: string;
    createdBy: User;
}
