/*eslint no-process-env:0*/
import _ from 'lodash';

var all = require('./all');

module.exports = _.merge(
    all,
    // require('./shared').default,
    require(`./${process.env.NODE_ENV}`) || {});
