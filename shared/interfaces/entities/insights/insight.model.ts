import { Entity, EntityAttachment } from '../entity.model';

/**
 * @swagger
 * components:
 *   schemas:
 *     Insight:
 *       type: object
 *       properties:
 *         projectId:
 *           type: string
 *         insightType:
 *           type: string
 *         attachments:
 *           type: array
 *           items:
 *              $ref: '#/components/schemas/EntityAttachment'
 */
export interface Insight extends Entity {
    projectId: string;
    insightType: string;
    attachments?: EntityAttachment[];
}
