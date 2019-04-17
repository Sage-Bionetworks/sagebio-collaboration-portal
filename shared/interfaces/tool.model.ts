import { User } from './user.model';
import { Organization } from './organization.model';

// @flow
export interface Tool {
    id?: string;
    _id?: string;
    name: string;
    description: string;
    picture?: string;
    apiServerUrl: string;
    webpage: string;
    supportedFormats: string[];
    // supportedDataTyoes: string[];
    organization: Organization;
    createdAt: string;
    createdBy?: User;
}
