import { InsightAttachment } from '../insights/insight.model';
import { ResourceAttachment } from '../resources/resource.model';

/**
 * @swagger
 * components:
 *   schemas:
 *     EntityAttachments:
 *       type: object
 *       properties:
 *         insights:
 *           type: array
 *           items:
 *              $ref: '#/components/schemas/InsightAttachment'
 *         resources:
 *           type: array
 *           items:
 *              $ref: '#/components/schemas/ResourceAttachment'
 */
export interface EntityAttachments {
    insights?: InsightAttachment[];
    resources?: ResourceAttachment[];
}
