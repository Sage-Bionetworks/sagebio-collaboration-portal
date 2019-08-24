/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

import Article from '../api/resource/models/article.model';
import Dashboard from '../api/resource/models/dashboard.model';
import DataCatalog from '../api/data-catalog/data-catalog.model';
import EntityPermission from '../api/entity-permission/entity-permission.model';
import MessageNotification from '../api/notification/models/message-notification.model';
import EntityAccessNotification from '../api/notification/models/entity-access-notification.model';
import EntityNotification from '../api/notification/models/entity-notification.model';
import Thread from '../api/thread/thread.model';
import Memo from '../api/insight/models/memo.model';
import Message from '../api/message/message.model';
import Organization from '../api/organization/organization.model';
import Project from '../api/project/project.model';
import Report from '../api/insight/models/report.model';
import StarredMessage from '../api/starred-message/starred-message.model';
import State from '../api/resource/models/state.model';
import Tool from '../api/tool/tool.model';
import User from '../api/user/user.model';
import UserPermission from '../api/user-permission/user-permission.model';
import WebApp from '../api/resource/models/webapp.model';
import {
    createActivities
} from '../api/provenance/provenance.controller';
import config from './environment';
import seeds from './seeds';

var express = require('express');

export function seedDatabaseIfNeeded() {
    // there is a race condition between the unit tests and the seed creation.
    if (config.env === 'test' || !seeds) {
        return;
    }
    console.log(`Initializing db with seed: ${config.init.dbSeedName}`);

    let promises = [];
    let promise;

    promise = Article.find({}).deleteMany()
        .then(() => seeds.articles ? Article
            .create(seeds.articles)
            .then(() => console.log('finished populating articles')) : null
        )
        .catch(err => console.log('error populating articles', err));
    promises.push(promise);


    promise = Dashboard.find({}).deleteMany()
        .then(() => seeds.dashboards ? Dashboard
            .create(seeds.dashboards)
            .then(() => console.log('finished populating dashboards')) : null
        )
        .catch(err => console.log('error populating dashboards', err));
    promises.push(promise);


    promise = DataCatalog.find({}).deleteMany()
        .then(() => seeds.dataCatalogs ? DataCatalog
            .create(seeds.dataCatalogs)
            .then(() => console.log('finished populating data catalogs')) : null
        )
        .catch(err => console.log('error populating data catalogs', err));
    promises.push(promise);


    promise = EntityPermission.find({}).deleteMany()
        .then(() => seeds.entityPermissions ? EntityPermission
            .create(seeds.entityPermissions)
            .then(() => console.log('finished populating entity permissions')) : null
        )
        .catch(err => console.log('error populating entity permissions', err));
    promises.push(promise);

    promise = MessageNotification.find({}).deleteMany()
        .then(() => seeds.messageNotifications ? MessageNotification
            .create(seeds.messageNotifications)
            .then(() => console.log('finished populating message notifications')) : null)
        .catch(err => console.log('error populating message notifications', err));
    promises.push(promise);

    promise = EntityAccessNotification.find({}).deleteMany()
        .then(() => seeds.entityAccessNotifications ? EntityAccessNotification
            .create(seeds.entityAccessNotifications)
            .then(() => console.log('finished populating entity access notifications')) : null
        )
        .catch(err => console.log('error populating entity access notifications', err));
    promises.push(promise);

    promise = EntityNotification.find({}).deleteMany()
        .then(() => seeds.entityNotifications ? EntityNotification
            .create(seeds.entityNotifications)
            .then(() => console.log('finished populating entity notifications')) : null
        )
        .catch(err => console.log('error populating entity notifications', err));
    promises.push(promise);

    promise = Thread.find({}).deleteMany()
        .then(() => seeds.threads ? Thread
            .create(seeds.threads)
            .then(() => console.log('finished populating threads')) : null
        )
        .catch(err => console.log('error populating threads', err));
    promises.push(promise);

    promise = Memo.find({}).deleteMany()
        .then(() => seeds.memos ? Memo
            .create(seeds.memos)
            .then(() => console.log('finished populating memos')) : null
        )
        .catch(err => console.log('error populating memos', err));
    promises.push(promise);

    promise = Message.find({}).deleteMany()
        .then(() => seeds.messages ? Message
            .create(seeds.messages)
            .then(() => console.log('finished populating messages')) : null
        )
        .catch(err => console.log('error populating messages', err));
    promises.push(promise);

    promise = Organization.find({}).deleteMany()
        .then(() => seeds.organizations ? Organization
            .create(seeds.organizations)
            .then(() => console.log('finished populating organizations')) : null
        )

        .catch(err => console.log('error populating organizations', err));
    promises.push(promise);

    promise = Project.find({}).deleteMany()
        .then(() => seeds.projects ? Project
            .create(seeds.projects)
            .then(() => console.log('finished populating projects')) : null
        )
        .catch(err => console.log('error populating projects', err));
    promises.push(promise);

    promise = StarredMessage.find({}).deleteMany()
        .then(() => seeds.starredMessages ? StarredMessage
            .create(seeds.starredMessages)
            .then(() => console.log('finished populating starred messages')) : null
        )
        .catch(err => console.log('error populating starred messages', err));
    promises.push(promise);

    promise = State.find({}).deleteMany()
        .then(() => seeds.states ? State
            .create(seeds.states)
            .then(() => console.log('finished populating states')) : null
        )
        .catch(err => console.log('error populating states', err));
    promises.push(promise);

    promise = Report.find({}).deleteMany()
        .then(() => seeds.reports ? Report
            .create(seeds.reports)
            .then(() => console.log('finished populating reports')) : null
        )
        .catch(err => console.log('error populating reports', err));
    promises.push(promise);

    promise = Tool.find({}).deleteMany()
        .then(() => seeds.tools ? Tool
            .create(seeds.tools)
            .then(() => console.log('finished populating tools')) : null
        )
        .catch(err => console.log('error populating tools', err));
    promises.push(promise);

    promise = User.find({}).deleteMany()
        .then(() => seeds.users ? User
            .create(seeds.users)
            .then(() => console.log('finished populating users')) : null
        )
        .catch(err => console.log('error populating users', err));
    promises.push(promise);


    promise = UserPermission.find({}).deleteMany()
        .then(() => seeds.userPermissions ? UserPermission
            .create(seeds.userPermissions)
            .then(() => console.log('finished populating user permissions')) : null
        )
        .catch(err => console.log('error populating user permissions', err));
    promises.push(promise);

    promise = WebApp.find({}).deleteMany()
        .then(() => seeds.webapps ? WebApp
            .create(seeds.webapps)
            .then(() => console.log('finished populating webapps')) : null
        )
        .catch(err => console.log('error populating webapps', err));
    promises.push(promise);

    return Promise.all(promises);
}

export function seedProvenanceIfNeeded() {
    // there is a race condition between the unit tests and the seed creation.
    if (config.env === 'test' || !seeds || !seeds.activities) {
        return;
    }

    let promises = [];
    let promise;

    promise = createActivities(seeds.activities)
        .then(() => console.log('finished populating activities'))
        .catch(err => console.log('error populating activities', err));
    promises.push(promise);

    return Promise.all(promises);
}
