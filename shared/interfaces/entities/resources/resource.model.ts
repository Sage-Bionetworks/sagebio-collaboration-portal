import { Entity } from '../entity.model';

/**
 * @swagger
 * components:
 *   schemas:
 *     Resource:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *         resourceType:
 *           type: string
 */
export interface Resource extends Entity {
    url: string;
    resourceType?: string;
}
