import { User } from './user.model';

export interface Insight {
    _id?: string;
    name: string;
    description: string;
    createdAt: string;
    createdBy?: User;

    data: string;  // TODO: remove
}
