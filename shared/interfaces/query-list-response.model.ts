/**
 * @swagger
 * components:
 *   schemas:
 *     QueryListResponse:
 *       type: object
 *       properties:
 *         count:
 *           type: number
 *         results:
 *           type: array
 *           items:
 *             type: '#/components/schemas/Resource'
 */
export interface QueryListResponse<T> {
    count: number;
    results: T[];
}
