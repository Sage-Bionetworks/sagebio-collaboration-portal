import { User } from './user.model';

export interface Article {
    id_?: string;
    slug: string;
    title: string;
    description: string;
    body: string;
    tagList: string[];
    favorited: boolean;
    favoritesCount: number;
    createdAt: string;
    updatedAt: string;
    createdBy: User;
}
