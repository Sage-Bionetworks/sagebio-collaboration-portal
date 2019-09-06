/**
 * Socket.io configuration
 */
import path from 'path';
import Primus from 'primus';
import primusEmit from 'primus-emit';
import app from '../primus/primus-app';

const registerFunctions = [
    // Insert sockets below
    require('../api/provenance/provenance.socket').register,
    require('../api/entity-permission/entity-permission.socket').register,
    require('../api/starred-message/starred-message.socket').register,
    require('../api/message/message.socket').register,
    require('../api/thread/thread.socket').register,
    require('../api/project/project.socket').register,
    require('../api/organization/organization.socket').register,
    require('../api/data-catalog/data-catalog.socket').register,
    require('../api/tool/tool.socket').register,
    require('../api/insight/insight.socket').register,
    require('../api/resource/resource.socket').register,
    require('../api/dataset/dataset.socket').register,
    require('../api/user/user.socket').register,
    require('../api/user-permission/user-permission.socket').register
];

// When the user disconnects.. perform this
function onDisconnect(spark) {
    console.info(
        `WebSocket from ${spark.address.ip}:${spark.address.port} disconnected`
    );
}

// When the user connects.. perform this
function onConnect(spark) {
    console.info(
        `WebSocket from ${spark.address.ip}:${spark.address.port} connected`
    );

    spark.setMaxListeners(32);

    // When the client emits 'info', this listens and executes
    spark.on('info', data => {
        spark.log(JSON.stringify(data, null, 2));
    });

    spark.on('data', data => {
        console.log('Spark data:', data);
    });

    spark.on('error', err => {
        console.log('Spark error', err);
    });

    // Register the spark with each WebSocket event handler
    for (let register of registerFunctions) {
        register(spark);
    }
}

let primus;

export function broadcast(message) {
    primus.forEach(spark => {
        spark.emit('broadcast', message);
    });
}

export default function initWebSocketServer(server) {
    primus = new Primus(server, { // options
        // port: 443, // here?
        // transport: {
        //     // port: 443 // here? has an effect on the server
        // },
        transformer: 'websockets'
    });
    // primus = Primus.createServer(function connection(spark) {
    //
    // }, {
    //     port: 443,
    //     transformer: 'websockets'
    // });
    primus.plugin('emit', primusEmit);
    primus.plugin('app', app);

    primus.on('connection', onConnect);
    primus.on('disconnection', onDisconnect);

    if (process.env.NODE_ENV === 'development') {
        return new Promise((resolve, reject) => {
            // Save the primus client library configured for our server settings
            primus.save(
                path.join(
                    __dirname,
                    '../../client/components/socket/primus.js'
                ),
                err => {
                    if (err) return reject(err);

                    resolve(primus);
                }
            );
        });
    } else {
        return Promise.resolve(primus);
    }
}
