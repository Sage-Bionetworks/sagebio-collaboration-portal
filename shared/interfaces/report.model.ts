import { User } from './user.model';
import { Insight } from './insight.model';

// @flow
export interface Report extends Insight {
    id?: string;
    _id?: string;
    name: string;
    description: string;
    createdAt: string;
    createdBy?: User;
}
