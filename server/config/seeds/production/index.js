/*eslint no-process-env:0*/

import {
    organizations
} from './organizations'
import {
    users
} from './users';
import {
    dataCatalogs
} from './data-catalogs';
import {
    tools
} from './tools';
import {
    insights
} from './insights';
import {
    states
} from './states';

module.exports = {
    organizations: organizations,
    users: users,
    dataCatalogs: dataCatalogs,
    tools: tools,
    insights: insights,
    states: states
};
