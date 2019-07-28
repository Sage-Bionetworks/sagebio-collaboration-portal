/*eslint no-process-env:0*/
import {
    merge
} from 'lodash';
import config from '../../config/environment';

var default_ = require('./default');

module.exports = config.init.dbSeedName ? merge(
    default_,
    require(`./${config.init.dbSeedName}`) || {}) : null;
