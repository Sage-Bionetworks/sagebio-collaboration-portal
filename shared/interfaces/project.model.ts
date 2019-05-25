import { User } from './user.model';

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         picture:
 *           type: string
 *         visibility:
 *           $ref: '#/components/schemas/ProjectVisibility'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         createdBy:
 *           $ref: '#/components/schemas/User'
 */
export interface Project {
    _id?: string;
    name: string;
    description: string;
    picture: string;
    visibility: ProjectVisibility;
    createdAt: string;
    createdBy: User;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ProjectVisibility:
 *       type: string
 *       enum:
 *         - Public
 *         - Private
 */
export enum ProjectVisibility {
    PUBLIC = 'Public',
    PRIVATE = 'Private'
}
