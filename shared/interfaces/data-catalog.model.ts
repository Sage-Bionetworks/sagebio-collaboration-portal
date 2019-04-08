import { User } from './user.model';

// @flow
export interface DataCatalog {
    id?: string;
    _id?: string;
    name: string;
    description: string;
    image?: string;
    apiBaseUri: string;
    webpage: string;
    createdAt: string;
    createdBy?: User;
}
