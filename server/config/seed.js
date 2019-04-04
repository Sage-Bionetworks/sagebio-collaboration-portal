/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

import Dataset from '../api/dataset/dataset.model';
import Insight from '../api/insight/insight.model';
import User from '../api/user/user.model';
import config from './environment/';

import {
    users
} from './seeds/users';
import {
    datasets
} from './seeds/datasets';
import {
    insights
} from './seeds/insights';

export default function seedDatabaseIfNeeded() {
    if (!config.seedDB) {
        return Promise.resolve();
    }

    let promises = [];

    let userPromise = User.find({}).deleteMany()
        .then(() => User.create(users))
        .then(() => console.log('finished populating users'))
        .catch(err => console.log('error populating users', err));
    promises.push(userPromise);

    let datasetPromise = Dataset.find({}).deleteMany()
        .then(() => Dataset.create(datasets))
        .then(() => console.log('finished populating datasets'))
        .catch(err => console.log('error populating datasets', err));
    promises.push(datasetPromise);

    let insightPromise = Insight.find({}).deleteMany()
        .then(() => Insight.create(insights))
        .then(() => console.log('finished populating insights'))
        .catch(err => console.log('error populating insights', err));
    promises.push(insightPromise);

    return Promise.all(promises);
}
