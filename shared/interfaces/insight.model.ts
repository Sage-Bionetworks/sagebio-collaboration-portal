import { User } from './user.model';

// @flow
export interface Insight {
    id?: string;
    _id?: string;
    name: string;
    createdAt: string;
    createdBy?: User;
}
