import { User } from './user.model';

// @flow
export interface State {
    id?: string;
    _id?: string;
    name: string;
    data: string;
    createdAt: string;
    createdBy?: User;
}
