/**
 * @swagger
 * components:
 *   schemas:
 *     Patch:
 *       type: object
 *       properties:
 *         op:
 *           type: string
 *         path:
 *           type: string
 *         value:
 *           type: string
 */
export interface Patch {
    op: string;
    path: string;
    value: any;
}
