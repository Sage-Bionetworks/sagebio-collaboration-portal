/*eslint no-process-env:0*/

import {
    messages
} from './messages';
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
    users
} from './users';
import {
    userPermissions
} from './user-permissions';

module.exports = {
    messages: messages,
    projects: projects,
    reports: reports,
    starredMessages: starredMessages,
    states: states,
    users: users,
    userPermissions: userPermissions
};
