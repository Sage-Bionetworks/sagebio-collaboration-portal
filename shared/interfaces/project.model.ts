import { User } from './user.model';

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         members:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *         admins:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *         public:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         createdBy:
 *           $ref: '#/components/schemas/User'
 */
export interface Project {
    _id?: string;
    name: string;
    description: string;
    members: User[];
    admins: User[];
    public: boolean;
    createdAt: string;
    createdBy: User;
}
