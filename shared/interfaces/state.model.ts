import { User } from './user.model';

// @flow
export interface State {
    id?: string;
    _id?: string;
    name: string;
    createdAt: string;
    createdBy?: User;
}
