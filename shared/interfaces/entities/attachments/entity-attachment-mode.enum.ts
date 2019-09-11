/**
 * @swagger
 * components:
 *   schemas:
 *     EntityAttachmentMode:
 *       type: string
 *       enum:
 *         - Edit
 *         - Display
 */
export enum EntityAttachmentMode {
    EDIT = 'Edit',
    DISPLAY = 'Display',
}
