import { Dataset } from '../dataset.model';
import { CkanOrganizationPreview } from './ckan-organization-preview.model';

// @flow
export interface CkanDataset {
    license_title: string;
    maintainer: string;
    name: string;
    title: string;
    organization: CkanOrganizationPreview;
}
