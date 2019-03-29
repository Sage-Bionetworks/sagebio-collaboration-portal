/**
 * Main application routes
 */

import errors from './components/errors';
import path from 'path';

var swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// const host = `http://${process.env.IP}:${process.env.PORT}`;

export default function(app) {
    // Insert routes below
    app.use('/api/datasets', require('./api/dataset'));
    app.use('/api/things', require('./api/thing'));
    app.use('/api/users', require('./api/user'));
    app.use('/auth', require('./auth').default);

    // swagger definition
    var swaggerDefinition = {
        info: {
            title: 'PHC Collaboration Portal API',
            version: '1.0.0',
            description: 'Primary Health Care (PHC) Collaboration Portal by Sage Bionetworks for Roche/Genentech',
        },
        // host: 'localhost:3000',
        basePath: '/api',
    };

    // options for the swagger docs
    var swaggerJSDocOptions = {
        swaggerDefinition: swaggerDefinition,
        apis: ['./**/api/**/index.js']
    };

    // initialize swagger-jsdoc
    const swaggerSpec = swaggerJSDoc(swaggerJSDocOptions);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets|api-docs)/*')
        .get(errors[404]);

    // All other routes should redirect to the app.html
    app.route('/*')
        .get((req, res) => {
            res.sendFile(path.resolve(`${app.get('appPath')}/app.html`));
        });
}
