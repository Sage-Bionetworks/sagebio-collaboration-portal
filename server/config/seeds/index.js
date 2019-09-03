/*eslint no-process-env:0*/
import {
    merge
} from 'lodash';
import { flow, groupBy, orderBy, map, keyBy, pick, mapValues, uniqBy, pickBy, get } from 'lodash/fp';
import config from '../../config/environment';
import { consoleTestResultHandler } from 'tslint/lib/test';
// import { message } from 'gulp-typescript/release/utils';

var default_ = require('./default');

var seeds = module.exports = config.init.dbSeedName ? merge(
    default_,
    require(`./${config.init.dbSeedName}`) || {}) : null;


const messagesStub = [{
    thread: 'A',
    createdBy: 'Thomas',
    createdAt: 2
},
{
    thread: 'B',
    createdBy: 'Thomas',
    createdAt: 2
},
{
    thread: 'A',
    createdBy: 'Bob',
    createdAt: 1
}
];

// Populating thread.contributors from messages
if (seeds.threads && seeds.messages) {
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
        contributors: get(thread._id, contributorsByThread)
    }));
}

module.exports = seeds;
