/**
 * Main application routes
 */

import errors from './components/errors';
import path from 'path';

const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger/swagger.json');
const YAML = require('yamljs');
const swaggerDocument = YAML.load(path.join(__dirname,'./swagger/swagger.yaml'));

export default function(app) {
    // Insert routes below
    app.use('/api/insights', require('./api/insight'));
    app.use('/api/datasets', require('./api/dataset'));
    app.use('/api/users', require('./api/user'));
    app.use('/auth', require('./auth').default);

    // swagger definition
    var swaggerDefinition = {
        info: {
            title: 'PHC Collaboration Portal API',
            version: '0.0.1',
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

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets|api-docs)/*')
        .get(errors[404]);

    // All other routes should redirect to the app.html
    app.route('/*')
        .get((req, res) => {
            res.sendFile(path.resolve(`${app.get('appPath')}/app.html`));
        });
}
