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

export default {
    env,
    port,
    userRoles,
    gitVersion,
    gitCommitHash,
    gitBranch
};
