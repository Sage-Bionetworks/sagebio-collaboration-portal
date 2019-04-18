/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

import Organization from '../api/organization/organization.model';
import User from '../api/user/user.model';
import Dataset from '../api/dataset/dataset.model';
import DataCatalog from '../api/data-catalog/data-catalog.model';
import Tool from '../api/tool/tool.model';
import State from '../api/state/state.model';
import Insight from '../api/insight/insight.model';
import seeds from './seeds'

export default function seedDatabaseIfNeeded() {

    let promises = [];

    if (seeds.organizations) {
        let promise = Organization.find({}).deleteMany()
            .then(() => Organization.create(seeds.organizations))
            .then(() => console.log('finished populating organizations'))
            .catch(err => console.log('error populating organizations', err));
        promises.push(promise);
    }

    if (seeds.users) {
        let promise = User.find({}).deleteMany()
            .then(() => User.create(seeds.users))
            .then(() => console.log('finished populating users'))
            .catch(err => console.log('error populating users', err));
        promises.push(promise);
    }

    if (seeds.datasets) {
        let promise = Dataset.find({}).deleteMany()
            .then(() => Dataset.create(seeds.datasets))
            .then(() => console.log('finished populating datasets'))
            .catch(err => console.log('error populating datasets', err));
        promises.push(promise);
    }

    if (seeds.dataCatalogs) {
        let promise = DataCatalog.find({}).deleteMany()
            .then(() => DataCatalog.create(seeds.dataCatalogs))
            .then(() => console.log('finished populating data catalogs'))
            .catch(err => console.log('error populating data catalogs', err));
        promises.push(promise);
    }

    if (seeds.tools) {
        let promise = Tool.find({}).deleteMany()
            .then(() => Tool.create(seeds.tools))
            .then(() => console.log('finished populating tools'))
            .catch(err => console.log('error populating tools', err));
        promises.push(promise);
    }

    if (seeds.states) {
        let promise = State.find({}).deleteMany()
            .then(() => State.create(seeds.states))
            .then(() => console.log('finished populating states'))
            .catch(err => console.log('error populating states', err));
        promises.push(promise);
    }

    if (seeds.insights) {
        let promise = Insight.find({}).deleteMany()
            .then(() => Insight.create(seeds.insights))
            .then(() => console.log('finished populating insights'))
            .catch(err => console.log('error populating insights', err));
        promises.push(promise);
    }

    return Promise.all(promises);
}
