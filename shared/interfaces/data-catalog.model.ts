import { User } from './user.model';
import { Organization } from './organization.model';

// @flow
export interface DataCatalog {
    id?: string;
    _id?: string;
    name: string;
    description: string;
    apiType: DataCatalogApiType;
    picture?: string;
    apiServerUrl: string;
    webpage: string;
    // active: boolean;
    organization: Organization;
    createdAt: string;
    createdBy?: User;
}
export enum DataCatalogApiType {
    CKAN = 'CKAN',
}
