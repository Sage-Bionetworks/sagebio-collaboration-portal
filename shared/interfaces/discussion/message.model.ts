import { UserProfile } from '../user-profile.model';
import { Tag } from '../tag.model';

export interface Message {
    _id?: string;
    body: string;
    tags: Tag[];
    createdAt: string;
    createdBy: UserProfile;
}
