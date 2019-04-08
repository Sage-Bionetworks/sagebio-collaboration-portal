import { User } from './user.model';

// @flow
export interface Tool {
    id?: string;
    _id?: string;
    name: string;
    description: string;
    image?: string;
    apiBaseUri: string;
    webpage: string;
    supportedFormats: string[];
    createdAt: string;
    createdBy?: User;
}
