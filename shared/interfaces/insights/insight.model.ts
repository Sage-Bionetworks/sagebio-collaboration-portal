import { UserProfile } from '../user-profile.model';

export interface Insight {
    _id?: string;
    title: string;
    description: string;
    insightType?: string;
    createdAt: string;
    createdBy: UserProfile;
}
