import { report2Id, report3Id } from './reports';
import { phccpShinyToolExample } from './tools';
import { entityTypes, insightTypes } from '../../environment/shared';

let entityAttachments = [
    {
        entityId: report2Id,
        entityType: entityTypes.INSIGHT.value,
        entitySubType: insightTypes.REPORT.value,
        parentEntityId: report3Id,
    },
    {
        entityId: phccpShinyToolExample._id,
        entityType: entityTypes.TOOL.value,
        parentEntityId: report3Id,
    },
];

export { entityAttachments };
