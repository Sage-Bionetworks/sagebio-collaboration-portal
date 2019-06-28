/*eslint no-process-env:0*/

import {
    dashboards
} from './dashboards';
import {
    dataCatalogs
} from './data-catalogs';
import {
    messages
} from './messages';
import {
    organizations
} from './organizations'
import {
    permissions
} from './permissions';
import {
    projects
} from './projects'
import {
    reports
} from './reports';
import {
    starredMessages
} from './starred-messages';
import {
    states
} from './states';
import {
    tags
} from './tags';
import {
    tools
} from './tools';
import {
    users
} from './users';
import {
    userPermissions
} from './user-permissions';

module.exports = {
    dashboards: dashboards,
    dataCatalogs: dataCatalogs,
    messages: messages,
    organizations: organizations,
    permissions: permissions,
    projects: projects,
    reports: reports,
    starredMessages: starredMessages,
    states: states,
    tags: tags,
    tools: tools,
    users: users,
    userPermissions: userPermissions
};
