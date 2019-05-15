import { User } from './user.model';
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
 *         apiServerUrl:
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
export interface Tool {
    _id?: string;
    slug: string;
    name: string;
    description: string;
    picture: string;
    website: string;
    organization: Organization;
    apiServerUrl: string;
    resourceFormats: string[];
    // supportedDataTypes: string[];
    createdAt: string;
    createdBy?: User;
}
