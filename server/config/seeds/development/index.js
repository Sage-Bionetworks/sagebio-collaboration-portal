/*eslint no-process-env:0*/

import {
    organizations
} from './organizations'
import {
    users
} from './users';
import {
    datasets
} from './datasets';
import {
    dataCatalogs
} from './data-catalogs';
import {
    tools
} from './tools';
import {
    insights
} from './insights';

module.exports = {
    organizations: organizations,
    users: users,
    datasets: datasets,
    dataCatalogs: dataCatalogs,
    tools: tools,
    insights: insights
};
