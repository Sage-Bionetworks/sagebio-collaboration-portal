import { User } from '../auth/user.model';
import { Organization } from '../organization.model';
import { Entity } from './entity.model';

/**
 * @swagger
 * components:
 *   schemas:
 *     DataCatalog:
 *       type: object
 *       properties:
 *         _id:
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
 *         apiType:
 *           $ref: '#/components/schemas/DataCatalogApiType'
 *         apiServerUrl:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         createdBy:
 *           $ref: '#/components/schemas/User'
 */
export interface DataCatalog extends Entity {
    picture: string;
    website: string;
    organization: Organization;
    apiType: DataCatalogApiType;
    apiServerUrl: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     DataCatalogApiType:
 *       type: string
 *       enum:
 *         - CKAN
 *         - GEN3
 *         - SYNPASE
 */
export enum DataCatalogApiType {
    CKAN = 'CKAN',
    GEN3 = 'GEN3',
    SYNAPSE = 'SYNAPSE'
}
