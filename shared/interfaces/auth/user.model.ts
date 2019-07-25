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
 *         info:
 *           type: string
 *         industry:
 *           type: string
 *         location:
 *           type: string
 */
export interface User {
    _id?: string;
    name: string;
    username: string;
    email: string;
    picture?: string;
    role: UserRole;
    position: string;
    orcid: string;
    createdAt: string;
    createdBy?: User;  // "Recursive rendering needs work", see https://github.com/swagger-api/swagger-ui/issues/3325
    info?: string;
    industry?: string;
    location?: string;
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
    USER = 'user',
    ADMIN = 'admin'
}
