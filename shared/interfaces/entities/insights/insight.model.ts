import { Entity } from '../entity.model';

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
}

// WIP Front-end InsightAttachment interface
export interface InsightAttachment {
    entityId?: string;
    entityType?: string;
    name?: string;
}
