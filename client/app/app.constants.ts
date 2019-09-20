import { merge } from 'lodash/fp';
import shared from '../../server/config/environment/shared';

let config = {
    avatar: {
        size: {
            nano: 26,
            mini: 30,
            small: 40,
        },
    },

    tooltip: {
        showDelay: 0,
    },

    activityTypeFilters: Object.values(shared.activityTypes).map((activityType: any) => {
        if (activityType.value === shared.activityTypes.REPORT_CREATION.value) {
            activityType.active = true;
        }
        return activityType;
    }),

    resourceTypeFilters: Object.values(shared.resourceTypes).map((resourceType: any) => {
        if (resourceType.value === shared.resourceTypes.DASHBOARD.value) {
            resourceType.active = true;
        }
        return resourceType;
    }),

    insightTypeFilters: Object.values(shared.insightTypes).map((insightType: any) => {
        if (insightType.value === shared.insightTypes.REPORT.value) {
            insightType.active = true;
        }
        return insightType;
    }),
};

export default merge(config, shared);
