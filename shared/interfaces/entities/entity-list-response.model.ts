import { Entity } from './entity.model';

export interface EntityListResponse<E extends Entity> {
    count: number;
    entities: E[];
}
