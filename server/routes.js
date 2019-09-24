/**
 * Main application routes
 */

import errors from './components/errors';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

export default app => {
    // Insert routes below
    app.use('/api/apps', require('./api/app'));
    app.use('/api/entity-permissions', require('./api/entity-permission'));
    app.use('/api/entity-attachments', require('./api/entity-attachment'));
    app.use('/api/user-notifications', require('./api/user-notification'));
    app.use('/api/threads', require('./api/thread'));
    app.use('/api/projects', require('./api/project'));
    app.use('/api/organizations', require('./api/organization'));
    app.use('/api/data-catalogs', require('./api/data-catalog'));
    app.use('/api/tools', require('./api/tool'));
    app.use('/api/insights', require('./api/insight'));
    app.use('/api/resources', require('./api/resource'));
    app.use('/api/datasets', require('./api/dataset'));
    app.use('/api/users', require('./api/user'));
    app.use('/api/action-permissions', require('./api/action-permission'));
    app.use('/api/health', require('./api/health'));
    app.use('/api/provenance', require('./api/provenance'));
    app.use('/auth', require('./auth').default);

    const swaggerOptions = {
        customSiteTitle: 'PHC Collaboration Portal API',
        customCss: '.topbar { display: none }',
        // docExpansion: 'none'
    };

    const swaggerSpec = require('/Users/tschaffter/dev/PHCCollaborationPortal/dist/client/swagger.json');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets|api-docs)/*')
        .get(errors[404]);

    // All other routes should redirect to the app.html
    app.route('/*')
        .get((req, res) => {
            res.sendFile(path.resolve(`${app.get('appPath')}/app.html`));
        });
};
