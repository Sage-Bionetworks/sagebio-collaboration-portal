import { Entity } from '../entity.model';

/**
 * @swagger
 * components:
 *   schemas:
 *     Resource:
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
 *         url:
 *           type: string
 *         projectId:
 *           type: string
 *         resourceType:
 *           $ref: '#/components/schemas/ResourceType'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         createdBy:
 *           $ref: '#/components/schemas/User'
 */
export interface Resource extends Entity {
    url: string;
    projectId: string;
    resourceType: ResourceType;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ResourceType:
 *       type: string
 *       enum:
 *         - Article
 *         - Dashboard
 *         - State
 *         - WebApp
 */
export enum ResourceType {
    ARTICLE = 'Article',
    DASHBOARD = 'Dashboard',
    STATE = 'State',
    WEBAPP = 'WebApp',
}

export interface ResourceAttachment {
    entityId?: string;
    entityType?: string;
    name?: string;
}
