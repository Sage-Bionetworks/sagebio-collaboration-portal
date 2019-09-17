import { UserProfile } from '../auth/user-profile.model';

export interface EntityPreview {
    _id: string;
    title: string;
    picture: string;
    createdBy: UserProfile;
}
