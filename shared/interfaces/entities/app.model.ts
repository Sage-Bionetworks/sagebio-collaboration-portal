import { Entity } from './entity.model';

/**
 * @swagger
 * components:
 *   schemas:
 *     App:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         createdBy:
 *           $ref: '#/components/schemas/User'
 */
export interface App extends Entity {}
