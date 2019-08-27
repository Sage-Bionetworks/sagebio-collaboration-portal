import { UserProfile } from './user-profile.model';

/**
 * @swagger
 * components:
 *   schemas:
 *     MessageNotification:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 */
export interface MessageNotification {
  _id?: string;
  notificationType: string;
  userId: UserProfile | string;
  access: string;
  archived: boolean;
  createdAt: string;
  createdBy: UserProfile;
  messageBody: string;
}

export interface EntityNotification {
  _id?: string;
  notificationType: string;
  userId: UserProfile;
  access: string;
  archived: boolean;
  createdAt: string;
  createdBy: UserProfile;
  entityId: string;
  entityType: string;
}

export interface EntityAccessNotification {
  _id?: string;
  notificationType: string;
  userId: UserProfile;
  access: string;
  archived: boolean;
  createdAt: string;
  createdBy: UserProfile;
  entityId: string;
  entityType: string;
  entityPermissionId: string;
}