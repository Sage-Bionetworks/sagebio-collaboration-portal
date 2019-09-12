import { Entity } from '../entity.model';

/**
 * @swagger
 * components:
 *   schemas:
 *     Insight:
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
 *         projectId:
 *           type: string
 *         insightType:
 *           $ref: '#/components/schemas/InsightType'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         createdBy:
 *           $ref: '#/components/schemas/User'
 *         attachments:
 *           type: array
 *           items:
 *              $ref: '#/components/schemas/EntityAttachment'
 */
export interface Insight extends Entity {
    projectId: string;
    insightType: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     InsightType:
 *       type: string
 *       enum:
 *         - Memo
 *         - Report
 */
export enum InsightType {
    MEMO = 'Memo',
    REPORT = 'Report',
}


export interface InsightAttachment {
    entityId?: string;
    entitySubType?: string;
    name?: string;
}

