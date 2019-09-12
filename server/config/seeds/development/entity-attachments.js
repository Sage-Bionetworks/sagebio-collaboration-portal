import { report2Id, report3Id } from './reports';
import { phccpShinyToolExample } from './tools';
import { entityTypes } from '../../environment/shared';

let entityAttachments = [
    {
        entityId: report3Id,
        entityType: entityTypes.INSIGHT.value,
        parentEntityId: report2Id,
    },
    {
        entityId: phccpShinyToolExample._id,
        entityType: entityTypes.TOOL.value,
        parentEntityId: report2Id,
    },
];

export { entityAttachments };
