/**
 * Main application routes
 */

import errors from './components/errors';
import path from 'path';

const swaggerUi = require('swagger-ui-express');
var swaggerJSDoc = require('swagger-jsdoc');
// const swaggerDocument = require('./swagger/swagger.json');
// const YAML = require('yamljs');
// const swaggerDocument = YAML.load(path.join(__dirname, './swagger/swagger.yaml'));

export default app => {
    // Insert routes below
    app.use('/api/provenance', require('./api/provenance'));
    app.use('/api/invites', require('./api/invite'));
    app.use('/api/entity-permissions', require('./api/entity-permission'));
    app.use('/api/messages', require('./api/message'));
    app.use('/api/projects', require('./api/project'));
    app.use('/api/organizations', require('./api/organization'));
    app.use('/api/data-catalogs', require('./api/data-catalog'));
    app.use('/api/tools', require('./api/tool'));
    app.use('/api/insights', require('./api/insight'));
    app.use('/api/datasets', require('./api/dataset'));
    app.use('/api/users', require('./api/user'));
    app.use('/api/user-permissions', require('./api/user-permission'));
    app.use('/api/states', require('./api/state'));
    app.use('/api/health', require('./api/health'));
    app.use('/auth', require('./auth').default);

    // swagger definition
    // maps to https://swagger.io/specification/#oasObject
    var swaggerDefinition = {
        openapi: '3.0.2',
        info: {
            title: 'PHC Collaboration Portal API',
            version: '1.0.0',
            description: `Personalized Health Care (PHC) Collaboration Portal
                developed by Sage Bionetworks and Roche/Genentech`,
            contact: {
                name: 'API Support',
                url: 'https://www.synapse.org',
                email: 'thomas.schaffter@sagebase.org'
            },
            license: {
                name: 'CC BY-NC 3.0',
                url: 'https://creativecommons.org/licenses/by-nc/3.0/'
            }
        },
        servers: [{
            url: 'https://dev.phc.sagesandbox.org/api',
            description: 'Development server'
        }],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            responses: {
                UnauthorizedError: {
                    description: 'Access token is missing or invalid'
                }
            }
        }
    };

    const swaggerOptions = {
        customSiteTitle: 'PHC Collaboration Portal API',
        customCss: '.topbar { display: none }',
        // docExpansion: 'none'
    };

    // options for the swagger docs
    var swaggerJSDocOptions = {
        swaggerDefinition: swaggerDefinition,
        apis: [
            './**/api/**/index.js',
            './**/auth/**/*.js',
            './shared/interfaces/**/*.ts'
            // './**/swagger/**/*.ts'
        ]
    };

    // initialize swagger-jsdoc
    const swaggerSpec = swaggerJSDoc(swaggerJSDocOptions);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

    // Swagger
    // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets|api-docs)/*')
        .get(errors[404]);

    // All other routes should redirect to the app.html
    app.route('/*')
        .get((req, res) => {
            res.sendFile(path.resolve(`${app.get('appPath')}/app.html`));
        });
};
