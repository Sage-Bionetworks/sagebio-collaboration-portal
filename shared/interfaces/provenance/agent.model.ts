import { UserProfile } from '../auth/user-profile.model';

export interface Agent {
    userId: UserProfile;
    name: string;
    description: string;
}
