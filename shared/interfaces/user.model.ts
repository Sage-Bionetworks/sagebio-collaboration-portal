import { User } from './user.model';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         picture:
 *           type: string
 *         role:
 *           $ref: '#/components/schemas/UserRole'
 *         orcid:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         createdBy:
 *           $ref: '#/components/schemas/User'
 */
export interface User {
    _id?: string;
    name: string;
    username: string;
    email: string;
    picture?: string;
    role: string;
    position: string;
    orcid: string;
    createdAt: string;
    createdBy?: User;  // "Recursive rendering needs work", see https://github.com/swagger-api/swagger-ui/issues/3325
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRole:
 *       type: string
 *       enum:
 *         - user
 *         - admin
 */
export enum UserRole {
    user = 'user',
    admin = 'admin'
}
