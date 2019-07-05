/**
 * @swagger
 * components:
 *   schemas:
 *     TokenResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *         expiresIn:
 *           type: number
 */
export interface TokenResponse {
    token: string;
    expiresIn: number;
}
