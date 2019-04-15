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

export const datasetOrders = {
    // ALPHA: {  // Sorting by title doesn't seem to work
    //     value: 'title asc',
    //     title: 'Alphabetical',
    //     active: true
    // },
    NEWEST: {
        value: 'metadata_created desc',
        title: 'Newest Datasets',
        active: true
    },
    OLDEST: {
        value: 'metadata_created asc',
        title: 'Oldest Datasets',
        active: false
    },
    RELEVANCE: {
        value: 'relevance asc',
        title: 'Relevance',
        active: false
    }
};

export default {
    env,
    port,
    userRoles,
    gitVersion,
    gitCommitHash,
    gitBranch
};
