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
    ALPHA: {
        value: 'name',
        title: 'Alphabetical',
        active: true
    },
    NEWEST: {
      value: 'metadata_created',
      title: 'Newest Datasets',
      active: true
    }
    // MIN_PLAY_TIME_ASC: {
    //   value: 'minPlayingTime',
    //   title: 'Min Playing Time (Low to High)'
    // },
    // MIN_PLAY_TIME_DESC: {
    //   value: '-minPlayingTime',
    //   title: 'Min Playing Time (High to Low)'
    // },
    // MAX_PLAY_TIME_ASC: {
    //   value: 'maxPlayingTime',
    //   title: 'Max Playing Time (Low to High)'
    // },
    // MAX_PLAY_TIME_DESC: {
    //   value: '-maxPlayingTime',
    //   title: 'Max Playing Time (High to Low)'
    // },
};

export default {
    env,
    port,
    userRoles,
    gitVersion,
    gitCommitHash,
    gitBranch
};
