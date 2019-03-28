import { CkanDataset } from './ckan-dataset.model';

// @flow
export interface CkanDatasetListResponse {
  help: string;
  success: boolean;
  result: CkanDataset[];
}
