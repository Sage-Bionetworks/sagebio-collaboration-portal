import { CkanDataset } from './ckan-dataset.model';

// @flow
export interface CkanDatasetSearchResponse {
    help: string;
    success: boolean;
    result: {
        count: number;
        results: CkanDataset[];
    }
}
