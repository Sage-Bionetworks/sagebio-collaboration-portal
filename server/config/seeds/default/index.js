/*eslint no-process-env:0*/

import {
    dataCatalogs
} from './data-catalogs';
import {
    dashboards
} from './dashboards';
import {
    organizations
} from './organizations'
import {
    tools
} from './tools';
import {
    users
} from './users';

module.exports = {
    dataCatalogs: dataCatalogs,
    dashboards: dashboards,
    organizations: organizations,
    tools: tools,
    users: users
};
