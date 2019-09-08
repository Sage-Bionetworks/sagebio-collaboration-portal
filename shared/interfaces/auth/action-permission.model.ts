/**
 * @swagger
 * components:
 *   schemas:
 *     ActionPermission:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *         action:
 *           type: string
 */
export interface ActionPermission {
    _id?: string;
    user: string;
    action: string;
}
