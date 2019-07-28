import { merge } from 'lodash/fp';
import shared from '../../server/config/environment/shared';

console.log('shared', shared);

var config = {
    avatar: {
        size: {
            nano: 26,
            mini: 30,
            small: 40
        }
    },

    tooltip: {
        showDelay: 0
    },

    insightTypeFilters: [{
        value: 'Report',
        title: 'Report',
        active: true
    }, {
        value: 'Memo',
        title: 'Memo'
    }],

    activityDirectionFilters: [{
        value: 'down',
        title: 'Down',
        active: true
    }, {
        value: 'up',
        title: 'Up'
    }],

    resourceTypeFilters: [{
        value: 'Dashboard',
        title: 'Dashboard',
        active: true
    }, {
        value: 'State',
        title: 'State'
    }]
};

export default merge(config, shared);
