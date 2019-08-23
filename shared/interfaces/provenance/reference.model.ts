import { Entity } from 'models/entities/entity.model';

export interface Reference {
    targetId: Entity;
    targetVersionId: string;
    name: string;
    class: string;
    subclass: string;
    description: string;
}
