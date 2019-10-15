/*eslint no-process-env:0*/
import { merge } from 'lodash';
import { flow, groupBy, orderBy, mapValues, uniqBy, get } from 'lodash/fp';
import config from '../../config/environment';
import { adminUserId } from './default/constants';
// import { message } from 'gulp-typescript/release/utils';

var default_ = require('./default');

var seeds = module.exports = config.init.dbSeedName
    ? merge(default_, require(`./${config.init.dbSeedName}`) || {})
    : null;

// Create entity-permissions with Admin access for the authors of projects
if (seeds && seeds.projects) {
    let permissions = seeds.projects.map(project => ({
        status: config.inviteStatusTypes.ACCEPTED.value,
        entityId: project._id,
        entityType: config.entityTypes.PROJECT.value,
        user: project.createdBy,
        access: config.accessTypes.ADMIN.value,
        createdBy: adminUserId,
    }));
    seeds.entityPermissions = [...seeds.entityPermissions, ...permissions];
}

// Create default action-permissions for the seed users
if (seeds && seeds.users) {
    const createProject = seeds.users.map(user => ({
        user: user._id,
        action: config.actionPermissionTypes.CREATE_PROJECT.value,
        createdBy: user._id,
    }));

    if (!seeds.actionPermissions) {
        seeds.actionPermissions = [];
    }

    seeds.actionPermissions.push(...createProject);
}

// Create entity-permissions with Admin access for the authors of tools
if (seeds && seeds.tools) {
    let permissions = seeds.tools.map(tool => ({
        status: config.inviteStatusTypes.ACCEPTED.value,
        entityId: tool._id,
        entityType: config.entityTypes.TOOL.value,
        user: tool.createdBy,
        access: config.accessTypes.ADMIN.value,
        createdBy: adminUserId,
    }));
    seeds.entityPermissions = [...seeds.entityPermissions, ...permissions];
}

// Populate thread.contributors from messages
if (seeds && seeds.threads && seeds.messages) {
    const contributorsByThread = flow([
        groupBy('thread'),
        // contributors are ordered by their last message posted to the thread
        // TODO use the same implementation as used in the api (no code duplicates)
        mapValues(messages => orderBy('createdAt', 'asc', messages)),
        mapValues(messages => uniqBy('createdBy', messages)),
        mapValues(messages => orderBy('createdAt', 'desc', messages)),
        mapValues(messages => messages.map(m => m.createdBy)),
    ])(seeds.messages);

    seeds.threads = seeds.threads.map(thread => ({
        ...thread,
        contributors: get(thread._id, contributorsByThread),
    }));
}

module.exports = seeds;
