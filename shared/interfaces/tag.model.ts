import { User } from './user.model';

export interface Tag {
    id_?: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    createdBy: User;
}
