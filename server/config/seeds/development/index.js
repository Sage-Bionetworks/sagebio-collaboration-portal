/*eslint no-process-env:0*/

import {
    articles
} from './articles';
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
    messageNotifications
} from './message-notifications';
import {
    entityAccessNotifications
} from './entity-access-notifications';
import {
    entityNotifications
} from './entity-notifications';
import {
    memos
} from './memos';
import {
    messages
} from './messages';
import {
    threads
} from './threads';
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
import {
    organizations
} from './organizations';
import {
    webapps
} from './webapps';

module.exports = {
    articles: articles,
    dataCatalogs: dataCatalogs,
    dashboards: dashboards,
    entityPermissions: entityPermissions,
    messageNotifications: messageNotifications,
    entityAccessNotifications: entityAccessNotifications,
    entityNotifications: entityNotifications,
    threads: threads,
    memos: memos,
    messages: messages,
    projects: projects,
    activities: activities,
    reports: reports,
    starredMessages: starredMessages,
    states: states,
    tools: tools,
    users: users,
    userPermissions: userPermissions,
    organizations: organizations,
    webapps: webapps,
};
