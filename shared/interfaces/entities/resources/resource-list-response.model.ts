import { Resource } from './resource.model';
import { EntityListResponse } from '../entity-list-response.model';

/**
 * @swagger
 * components:
 *   schemas:
 *     ResourceListResponse:
 *       type: object
 *       properties:
 *         count:
 *           type: number
 *         entities:
 *           type: array
 *           items:
 *             type: '#/components/schemas/Resource'
 */
export interface ResourceListResponse extends EntityListResponse<Resource> {}
