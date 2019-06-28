/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

import Dashboard from '../api/insight/models/dashboard.model';
import DataCatalog from '../api/data-catalog/data-catalog.model';
import Message from '../api/message/message.model';
import Organization from '../api/organization/organization.model';
import Permission from '../api/permission/permission.model';
import Project from '../api/project/project.model';
import Report from '../api/insight/models/report.model';
import StarredMessage from '../api/starred-message/starred-message.model';
import State from '../api/insight/models/state.model';
import Tag from '../api/tag/tag.model';
import Tool from '../api/tool/tool.model';
import User from '../api/user/user.model';
import UserPermissions from '../api/permission/user-permission.model';

import seeds from './seeds'

export default function seedDatabaseIfNeeded() {

    let promises = [];

    if (seeds.dashboards) {
        let promise = Dashboard.find({}).deleteMany()
            .then(() => Dashboard.create(seeds.dashboards))
            .then(() => console.log('finished populating dashboards'))
            .catch(err => console.log('error populating dashboards', err));
        promises.push(promise);
    }

    if (seeds.dataCatalogs) {
        let promise = DataCatalog.find({}).deleteMany()
            .then(() => DataCatalog.create(seeds.dataCatalogs))
            .then(() => console.log('finished populating data catalogs'))
            .catch(err => console.log('error populating data catalogs', err));
        promises.push(promise);
    }

    if (seeds.insights) {
        let promise = Insight.find({}).deleteMany()
            .then(() => Insight.create(seeds.insights))
            .then(() => console.log('finished populating insights'))
            .catch(err => console.log('error populating insights', err));
        promises.push(promise);
    }

    if (seeds.messages) {
        let promise = Message.find({}).deleteMany()
            .then(() => Message.create(seeds.messages))
            .then(() => console.log('finished populating messages'))
            .catch(err => console.log('error populating messages', err));
        promises.push(promise);
    }

    if (seeds.organizations) {
        let promise = Organization.find({}).deleteMany()
            .then(() => Organization.create(seeds.organizations))
            .then(() => console.log('finished populating organizations'))
            .catch(err => console.log('error populating organizations', err));
        promises.push(promise);
    }

    if (seeds.permissions) {
        let promise = Permission.find({}).deleteMany()
            .then(() => Permission.create(seeds.permissions))
            .then(() => console.log('finished populating permissions'))
            .catch(err => console.log('error populating permissions', err));
        promises.push(promise);
    }

    if (seeds.projects) {
        let promise = Project.find({}).deleteMany()
            .then(() => Project.create(seeds.projects))
            .then(() => console.log('finished populating projects'))
            .catch(err => console.log('error populating projects', err));
        promises.push(promise);
    }

    if (seeds.starredMessages) {
        let promise = StarredMessage.find({}).deleteMany()
            .then(() => StarredMessage.create(seeds.starredMessages))
            .then(() => console.log('finished populating starred messages'))
            .catch(err => console.log('error populating starred messages', err));
        promises.push(promise);
    }

    if (seeds.states) {
        let promise = State.find({}).deleteMany()
            .then(() => State.create(seeds.states))
            .then(() => console.log('finished populating states'))
            .catch(err => console.log('error populating states', err));
        promises.push(promise);
    }

    if (seeds.reports) {
        let promise = Report.find({}).deleteMany()
            .then(() => Report.create(seeds.reports))
            .then(() => console.log('finished populating reports'))
            .catch(err => console.log('error populating reports', err));
        promises.push(promise);
    }

    if (seeds.tags) {
        let promise = Tag.find({}).deleteMany()
            .then(() => Tag.create(seeds.tags))
            .then(() => console.log('finished populating tags'))
            .catch(err => console.log('error populating tags', err));
        promises.push(promise);
    }

    if (seeds.tools) {
        let promise = Tool.find({}).deleteMany()
            .then(() => Tool.create(seeds.tools))
            .then(() => console.log('finished populating tools'))
            .catch(err => console.log('error populating tools', err));
        promises.push(promise);
    }

    if (seeds.users) {
        let promise = User.find({}).deleteMany()
            .then(() => User.create(seeds.users))
            .then(() => console.log('finished populating users'))
            .catch(err => console.log('error populating users', err));
        promises.push(promise);
    }

    if (seeds.userPermissions) {
        let promise = UserPermissions.find({}).deleteMany()
            .then(() => UserPermissions.create(seeds.userPermissions))
            .then(() => console.log('finished populating user permissions'))
            .catch(err => console.log('error populating user permissions', err));
        promises.push(promise);
    }

    return Promise.all(promises);
}
