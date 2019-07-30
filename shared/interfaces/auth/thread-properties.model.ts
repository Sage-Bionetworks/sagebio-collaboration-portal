import User from "../../../server/api/user/user.model";

/**
 * @swagger
 * components:
 *   schemas:
 *     ThreadProperties:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         entityId:
 *           type: string
 *         entityType:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         createdBy:
 *           $ref: '#/components/schemas/UserProfile'
 */
export interface ThreadProperties {
    _id?: string;
    title: string;
    entityId: string;
    entityType: string;
    createdAt: string;
    updatedAt: string;
    createdBy: User;
}
