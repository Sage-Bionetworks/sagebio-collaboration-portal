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
        value: 'Dashboard',
        title: 'Dashboard',
        active: true
    }, {
        value: 'Report',
        title: 'Report'
    }, {
        value: 'State',
        title: 'State'
    }],

    activityDirectionFilters: [{
        value: 'down',
        title: 'Down',
        active: true
    }, {
        value: 'up',
        title: 'Up'
    }],
};

export default merge(config, shared);
