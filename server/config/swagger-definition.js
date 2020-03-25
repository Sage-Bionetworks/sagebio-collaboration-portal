module.exports = {
    openapi: '3.0.2',
    info: {
        title: 'SageBio Collaboration Portal API',
        version: '1.0.0', // TODO Get version from config
        description: `Personalized Health Care (SageBio) Collaboration Portal
                developed by Sage Bionetworks and Roche/Genentech`,
        contact: {
            name: 'API Support',
            url: 'https://www.synapse.org',
            email: 'thomas.schaffter@sagebase.org',
        },
        license: {
            name: 'CC BY-NC 3.0',
            url: 'https://creativecommons.org/licenses/by-nc/3.0/',
        },
    },
    servers: [
        {
            url: 'https://localhost/api', // `${config.domain}/api`,
            description: 'This app',
        },
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        responses: {
            UnauthorizedError: {
                description: 'Access token is missing or invalid',
            },
        },
    },
};
