/**
 * @swagger
 * components:
 *   schemas:
 *     EntityVisibility:
 *       type: string
 *       enum:
 *         - Public
 *         - Private
 */
export enum EntityVisibility {
    PUBLIC = 'Public',
    PRIVATE = 'Private'
}
