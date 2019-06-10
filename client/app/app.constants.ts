import { merge } from 'lodash/fp';

import shared from '../../server/config/environment/shared';

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
    }
};

export default merge(config, shared);
