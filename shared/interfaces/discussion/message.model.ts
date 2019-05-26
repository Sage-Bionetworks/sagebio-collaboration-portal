import { UserProfile } from '../user-profile.model';
import { Tag } from './tag.model';

export interface Message {
    id_?: string;
    slug: string;
    title: string;
    body: string;
    tags: Tag[];
    createdAt: string;
    createdBy: UserProfile;
}
