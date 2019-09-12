export interface EntityAttachment {
    _id?: string;
    entityId: string;
    entityType: string;
    entitySubType?: string;
    parentEntityId: string;
}
