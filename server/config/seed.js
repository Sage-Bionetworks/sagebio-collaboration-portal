/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

import Dataset from '../api/dataset/dataset.model';
import Insight from '../api/insight/insight.model';
import User from '../api/user/user.model';
import seeds from './seeds'

export default function seedDatabaseIfNeeded() {

    let promises = [];

    if (seeds.users) {
        let userPromise = User.find({}).deleteMany()
            .then(() => User.create(seeds.users))
            .then(() => console.log('finished populating users'))
            .catch(err => console.log('error populating users', err));
        promises.push(userPromise);
    }

    if (seeds.datasets) {
        let datasetPromise = Dataset.find({}).deleteMany()
            .then(() => Dataset.create(seeds.datasets))
            .then(() => console.log('finished populating datasets'))
            .catch(err => console.log('error populating datasets', err));
        promises.push(datasetPromise);
    }

    if (seeds.insights) {
        let insightPromise = Insight.find({}).deleteMany()
            .then(() => Insight.create(seeds.insights))
            .then(() => console.log('finished populating insights'))
            .catch(err => console.log('error populating insights', err));
        promises.push(insightPromise);
    }

    return Promise.all(promises);
}
