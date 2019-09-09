import { Entity } from './entity.model';
import { Organization } from './organization.model';

/**
 * @swagger
 * components:
 *   schemas:
 *     Tool:
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
 *         organization:
 *           $ref: '#/components/schemas/Organization'
 *         website:
 *           type: string
 *         apiHealthCheckUrl:
 *           type: string
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
    website: string;
    organization: Organization;
    apiHealthCheckUrl: string;
    resourceFormats: string[];
}
