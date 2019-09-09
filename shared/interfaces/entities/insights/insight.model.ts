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
 */
export interface Insight extends Entity {
    projectId: string;
    insightType: string;
}

export interface InsightAttachment {
    entityId?: string;
    entitySubType?: string;
    name?: string;
}
