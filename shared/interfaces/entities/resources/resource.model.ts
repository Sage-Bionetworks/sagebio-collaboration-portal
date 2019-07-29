import { Entity } from '../entity.model';

export interface Resource extends Entity {
    url: string;
    resourceType?: string;
}
