import { CkanDataset } from './ckan-dataset.model';

// @flow
export interface CkanDatasetResponse {
  help: string;
  success: boolean;
  result: CkanDataset;
}
