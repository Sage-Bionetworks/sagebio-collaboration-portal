import { merge } from 'lodash/fp';
import shared from '../../server/config/environment/shared';

var config = {
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

    activityTypeFilters: [
        {
            value: 'Report generation',
            title: 'Report generation',
            active: true,
        },
        {
            value: 'Memoization',
            title: 'Memoization',
        },
        {
            value: 'Mention',
            title: 'Mention',
        },
        {
            value: 'Tool session',
            title: 'Tool session',
        },
    ],

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

export default merge(config, shared);
