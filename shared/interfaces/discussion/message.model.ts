import { UserProfile } from '../user-profile.model';
import { Tag } from '../tag.model';

export interface Message {
    _id?: string;
    body: string;
    starred: boolean;
    tags: Tag[];
    createdAt: string;
    updatedAt: string;
    createdBy: UserProfile;
}
