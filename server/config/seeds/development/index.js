/*eslint no-process-env:0*/

import {
    dataCatalogs
} from './data-catalogs';
import {
    dashboards
} from './dashboards';
import {
    entityPermissions
} from './entity-permissions';
import {
    messages
} from './messages';
import {
    projects
} from './projects'
import {
    activities
} from './provenance';
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
    tools
} from './tools';
import {
    users
} from './users';
import {
    userPermissions
} from './user-permissions';

module.exports = {
    dataCatalogs: dataCatalogs,
    dashboards: dashboards,
    entityPermissions: entityPermissions,
    messages: messages,
    projects: projects,
    activities: activities,
    reports: reports,
    starredMessages: starredMessages,
    states: states,
    tools: tools,
    users: users,
    userPermissions: userPermissions,
};
