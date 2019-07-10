/*eslint no-process-env:0*/

export const env = process.env.NODE_ENV;
export const port = process.env.PORT || 9000;
// List of user roles
export const userRoles = ['user', 'admin'];

export const permissionTypes = [
    'createTool',
    'editTool',
    'deleteTool'
];

export const gitVersion = process.env.gitVersion;
export const gitCommitHash = process.env.gitCommitHash;
export const gitBranch = process.env.gitBranch;

export const ckanApiBaseUrl = 'https://ckan.phc.sagesandbox.org/api/3';

export const models = {
    project: {
        name: {
            minlength: 3,
            maxlength: 30
        },
        description: {
            minlength: 0,
            maxlength: 50
        },
        visibility: {
            values: ['Private', 'Public'],
            default: 'Private'
        }
    },
    message: {
        body: {
            minlength: 26, // 1 character when stringifying Quill content
            maxlength: 1024 * 1024 // allows for 500 KB (Unicode: 1 character = 2 bytes)
        }
    },
    insight: {
        description: {
            minlength: 26, // 1 character when stringifying Quill content
            maxlength: 1024 * 1024 // allows for 500 KB (Unicode: 1 character = 2 bytes)
        }
    },
    tool: {
        name: {
            minlength: 3,
            maxlength: 30
        },
        description: {
            minlength: 0,
            maxlength: 50
        },
    }
};

export const datasetOrders = {
    // ALPHA: {  // Sorting by title doesn't seem to work
    //     value: 'title asc',
    //     title: 'Alphabetical',
    //     active: true
    // },
    RELEVANCE: {
        value: 'relevance asc',
        title: 'Relevance',
        active: true
    },
    NEWEST: {
        value: 'metadata_created desc',
        title: 'Newest Datasets',
        active: false
    },
    OLDEST: {
        value: 'metadata_created asc',
        title: 'Oldest Datasets',
        active: false
    }
};

export default {
    env,
    port,
    userRoles,
    permissionTypes,
    gitVersion,
    gitCommitHash,
    gitBranch,
    // discourse,
    // feliteWebsite

    // authStrategies,
    models,
    datasetOrders
};
