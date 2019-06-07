import { UserProfile } from '../user-profile.model';
import { Tag } from '../tag.model';

export interface Message {
    _id?: string;
    body: string;
    thread?: string;
    createdAt: string;
    updatedAt: string;
    createdBy: UserProfile;
}
