import { User } from './user.model';

// @flow
export interface Tool {
    id?: string;
    _id?: string;
    name: string;
    description: string;
    image?: string;
    apiServerUrl: string;
    webpage: string;
    supportedFormats: string[];
    // supportedDataTyoes: string[];
    createdAt: string;
    createdBy?: User;
}
