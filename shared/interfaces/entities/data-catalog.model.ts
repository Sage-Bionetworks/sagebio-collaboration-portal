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
 *         organization:
 *           $ref: '#/components/schemas/Organization'
 *         apiType:
 *           $ref: '#/components/schemas/DataCatalogApiType'
 *         apiServerUrl:
 *           type: string
 *         apiHealthCheckUrl:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         createdBy:
 *           $ref: '#/components/schemas/User'
 */
export interface DataCatalog extends Entity {
    website: string;
    organization: Organization;
    apiType: DataCatalogApiType;
    apiServerUrl: string;
    apiHealthCheckUrl: string;
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
    CKAN = 'Ckan',
    GEN3 = 'Gen3',
    SYNAPSE = 'Synapse',
}
