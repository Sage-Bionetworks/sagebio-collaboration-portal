import { UserProfile } from "./user-profile.model";

/**
 * @swagger
 * components:
 *   schemas:
 *     Thread:
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
export interface Thread {
    _id: string;
    title: string;
    entityId: string;
    entityType: string;
    createdAt: string;
    updatedAt: string;
    createdBy: UserProfile;
}
