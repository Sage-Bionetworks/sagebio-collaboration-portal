/*eslint no-process-env:0*/

import { actionPermissions } from './action-permissions';
import { articles } from './articles';
import { dataCatalogs } from './data-catalogs';
import { dashboards } from './dashboards';
import { entityPermissions } from './entity-permissions';
import { entityAttachments } from './entity-attachments';
import { memos } from './memos';
import { messages } from './messages';
import { threads } from './threads';
import { projects } from './projects';
import { activities } from './provenance';
import { reports } from './reports';
import { starredMessages } from './starred-messages';
import { states } from './states';
import { tools } from './tools';
import { users } from './users';
import { organizations } from './organizations';
import { webapps } from './webapps';
import { messageNotifications } from './message-notifications';
import { entityAccessNotifications } from './entity-access-notifications';
import { entityNotifications } from './entity-notifications';

module.exports = {
    actionPermissions,
    articles,
    dataCatalogs,
    dashboards,
    entityPermissions,
    entityAttachments,
    threads,
    memos,
    messages,
    projects,
    activities,
    reports,
    starredMessages,
    states,
    tools,
    users,
    organizations,
    webapps,
    messageNotifications,
    entityAccessNotifications,
    entityNotifications,
};
