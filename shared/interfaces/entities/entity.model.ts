import { UserProfile } from '../auth/user-profile.model';

export interface Entity {
    _id?: string;
    title: string;
    description: string;
    createdAt: string;
    createdBy: UserProfile;
}
