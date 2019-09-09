import { UserProfile } from '../auth/user-profile.model';
import { Entity } from './entity.model';

/**
 * @swagger
 * components:
 *   schemas:
 *     Organization:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         picture:
 *           type: string
 *         visibility:
 *           $ref: '#/components/schemas/EntityVisibility'
 *         website:
 *           type: string
 *         domains:
 *           type: array
 *           items:
 *             type: string
 *         active:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         createdBy:
 *           $ref: '#/components/schemas/UserProfile'
 */
export interface Organization extends Entity {
    _id?: string;
    website: string;
    domains: string[];
    active: boolean;
    createdAt: string;
    createdBy: UserProfile;
}
