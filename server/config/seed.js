/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

import Dataset from '../api/dataset/dataset.model';
import Thing from '../api/thing/thing.model';
import User from '../api/user/user.model';
import config from './environment/';

import {
    datasets
} from './seeds/datasets'

export default function seedDatabaseIfNeeded() {
    if (!config.seedDB) {
        return Promise.resolve();
    }

    let promises = [];

    let datasetPromise = Dataset.find({}).deleteMany()
        .then(() => Dataset.create(datasets))
        .then(() => console.log('finished populating datasets'))
        .catch(err => console.log('error populating datasets', err));
    promises.push(datasetPromise);

    let thingPromise = Thing.find({}).deleteMany()
        .then(() => Thing.create({
            name: 'Development Tools',
            info: 'Integration with popular tools such as Webpack, Babel, TypeScript, Karma, Mocha, ESLint, Protractor, ' +
                'Pug, Stylus, Sass, and Less.'
        }, {
            name: 'Server and Client integration',
            info: 'Built with a powerful and fun stack: MongoDB, Express, Angular, and Node.'
        }, {
            name: 'Smart Build System',
            info: 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of ' +
                'scripts and styles into your app.html'
        }, {
            name: 'Modular Structure',
            info: 'Best practice client and server structures allow for more code reusability and maximum scalability'
        }, {
            name: 'Optimized Build',
            info: 'Build process packs up your templates as a single JavaScript payload, minifies your ' +
                'scripts/css/images, and rewrites asset names for caching.'
        }, {
            name: 'Deployment Ready',
            info: 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
        }))
        .then(() => console.log('finished populating things'))
        .catch(err => console.log('error populating things', err));
    promises.push(thingPromise);

    let userPromise = User.find({}).deleteMany()
        .then(() => User.create({
                provider: 'local',
                name: 'Test User',
                email: 'test@example.com',
                password: 'test'
            }, {
                provider: 'local',
                role: 'admin',
                name: 'Admin',
                email: 'admin@example.com',
                password: 'admin'
            })
            .then(() => console.log('finished populating users'))
            .catch(err => console.log('error populating users', err)));
    promises.push(userPromise);

    return Promise.all(promises);
}
