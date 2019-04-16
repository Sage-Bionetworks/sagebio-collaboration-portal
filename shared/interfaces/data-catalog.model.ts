import { User } from './user.model';

// @flow
export interface DataCatalog {
    id?: string;
    _id?: string;
    name: string;
    description: string;
    apiType: DataCatalogApiType;
    image?: string;
    apiServerUrl: string;
    webpage: string;
    // active: boolean;
    organizationName: string;
    organizationUrl: string;
    createdAt: string;
    createdBy?: User;
}
export enum DataCatalogApiType {
    CKAN = 'CKAN',
}
