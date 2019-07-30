import { UserProfile } from '../auth/user-profile.model';

export interface Thread {
    _id?: string;
    title: string;
    entityId: string;
    entityType: string;
    createdAt: string;
    updatedAt: string;
    createdBy: UserProfile;
}
