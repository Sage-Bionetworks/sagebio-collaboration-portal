/**
 * Module dependencies.
 */
// import authorize from './authorize';
import getUserId from './authorize';

/**
 * Export `App` module.
 */
module.exports = App;

/**
 * `App` constructor.
 *
 * @constructor
 * @param {Primus} primus Primus instance.
 * @param {Object} options The options.
 * @api public
 */
function App(primus) { // , options
    console.log('Using Primus App plugin');

    primus.$ = primus.$ || {};

    // primus.authorize(authorize);

    primus.on('connection', function (spark) {
        // authenticate user if the token is specified
        spark.userId = getUserId(spark.query.access_token);
        // spark.instanceId = spark.query.instanceId;
        console.log('spark.userId', spark.userId);
        // console.log('spark.instanceId', spark.instanceId);
    });
}
