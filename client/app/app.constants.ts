import { merge } from 'lodash/fp';
import shared from '../../server/config/environment/shared';

console.log('shared', shared);

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

    activityDirectionFilters: [
        {
            value: 'down',
            title: 'Down',
            active: true,
        },
        {
            value: 'up',
            title: 'Up',
        },
    ],

    resourceTypeFilters: [
        {
            value: 'Dashboard',
            title: 'Dashboard',
            active: true,
        },
        {
            value: 'State',
            title: 'State',
        },
        {
            value: 'WebApp',
            title: 'WebApp',
        },
        {
            value: 'Article',
            title: 'Article',
        },
    ],
};

console.log('app config', config.activityTypeFilters);

export default merge(config, shared);
