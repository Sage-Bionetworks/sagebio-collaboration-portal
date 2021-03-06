// import { Dataset } from '../dataset.model';
import { CkanOrganizationPreview } from './ckan-organization-preview.model';
import { CkanDatasetResource } from './ckan-dataset-resource.model';
// import { DataCatalog } from '../entities/data-catalog.model';

// @flow
export interface CkanDataset {
    id: string;
    license_title: string;
    maintainer: string;
    name: string;
    title: string;
    organization: CkanOrganizationPreview;
    resources: CkanDatasetResource[];
    // Portal specific
    // catalog: DataCatalog
}
