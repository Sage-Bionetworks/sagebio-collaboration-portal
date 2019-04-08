/**
 * Main application routes
 */

import errors from './components/errors';
import path from 'path';

const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger/swagger.json');
const YAML = require('yamljs');
const swaggerDocument = YAML.load(path.join(__dirname, './swagger/swagger.yaml'));

export default app => {
    // Insert routes below
    app.use('/api/data-catalogs', require('./api/data-catalog'));
    app.use('/api/tools', require('./api/tool'));
    app.use('/api/insights', require('./api/insight'));
    app.use('/api/datasets', require('./api/dataset'));
    app.use('/api/users', require('./api/user'));
    app.use('/auth', require('./auth').default);

    // Swagger
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets|api-docs)/*')
        .get(errors[404]);

    // All other routes should redirect to the app.html
    app.route('/*')
        .get((req, res) => {
            res.sendFile(path.resolve(`${app.get('appPath')}/app.html`));
        });
};
