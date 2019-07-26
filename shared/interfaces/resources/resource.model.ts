import { UserProfile } from '../auth/user-profile.model';

export interface Resource {
    _id?: string;
    title: string;
    description: string;
    url: string;
    resourceType?: string;
    createdAt: string;
    createdBy: UserProfile;
}
