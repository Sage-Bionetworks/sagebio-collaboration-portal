/*eslint no-process-env:0*/

export const env = process.env.NODE_ENV;
export const port = process.env.PORT || 9000;
// List of user roles
export const userRoles = ['guest', 'user', 'admin'];

export const gitVersion = process.env.gitVersion;
export const gitCommitHash = process.env.gitCommitHash;
export const gitBranch = process.env.gitBranch;

export const ckanApiBaseUrl = 'http://54.166.200.47/api/3';
// export const ckanApiBaseUrl = 'http://data.roche.com/api/3';


export const models = {
    project: {
        name: {
            minlength: 3,
            maxlength: 30
        },
        description: {
            minlength: 5,
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

export const discourse = {
    website: 'http://phc-discourse.sagesandbox.org',
    apiServerUrl: 'http://phc-discourse.sagesandbox.org'
};

// export const feliteWebsite = 'http://dev.phc.sagesandbox.org:8082'; // process.env.FELITE_WEBSITE;

export default {
    env,
    port,
    userRoles,
    gitVersion,
    gitCommitHash,
    gitBranch,
    // discourse,
    // feliteWebsite

    models,
    datasetOrders
};
