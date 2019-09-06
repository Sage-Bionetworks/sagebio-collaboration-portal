import { Entity } from '../entity.model';

/**
 * @swagger
 * components:
 *   schemas:
 *     Resource:
 *       type: object
 *       properties:
 *         projectId:
 *           type: string
 *         url:
 *           type: string
 *         resourceType:
 *           type: string
 */
export interface Resource extends Entity {
    projectId: string;
    url: string;
    resourceType: string;
}

export interface ResourceAttachment {
    entityId?: string;
    entityType?: string;
    name?: string;
}
