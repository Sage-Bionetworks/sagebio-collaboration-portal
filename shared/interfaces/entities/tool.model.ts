import { Entity } from './entity.model';
import { User } from '../auth/user.model';
import { Organization } from '../organization.model';

/**
 * @swagger
 * components:
 *   schemas:
 *     Tool:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         slug:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         picture:
 *           type: string
 *         website:
 *           type: string
 *         organization:
 *           $ref: '#/components/schemas/Organization'
 *         resourceFormats:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         createdBy:
 *           $ref: '#/components/schemas/User'
 */
export interface Tool extends Entity {
    slug: string;
    name: string;
    picture: string;
    website: string;
    organization: Organization;
    // apiServerUrl: string;
    apiHealthCheckUrl: string;
    resourceFormats: string[];
    // supportedDataTypes: string[];
}
