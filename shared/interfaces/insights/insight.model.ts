import { UserProfile } from '../user-profile.model';

export interface Insight {
    _id?: string;
    title: string;
    description: string;
    createdAt: string;
    createdBy: UserProfile;
}
