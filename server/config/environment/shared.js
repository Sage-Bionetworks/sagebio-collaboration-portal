/*eslint no-process-env:0*/

export const env = process.env.NODE_ENV;
export const port = process.env.PORT || 9000;
export const contactUsUrl = process.env.CONTACT_US_URL || 'https://webforms.roche.com/phcixcc';
// export const contactUsUrl = process.env.CONTACT_US_URL || 'https://sagebionetworks.org';

export const userRoles = {
    USER: {
        value: 'user'
    },
    ADMIN: {
        value: 'admin'
    }
};

export const permissionTypes = [
    'createTool',
    'editTool',
    'deleteTool'
];

export const entityTypes = {
    PROJECT: {
        value: 'project'
    }
};

export const insightTypes = {
    REPORT: {
        value: 'report',
        name: 'Report'
    },
    MEMO: {
        value: 'memo',
        name: 'Memo'
    }
};

export const accessTypes = {
    READ: {
        value: 'read',
        name: 'Read',
        description: 'Can read and download.'
    },
    WRITE: {
        value: 'write',
        name: 'Write',
        description: 'Can read, download, and write.'
    },
    ADMIN: {
        value: 'admin',
        name: 'Admin',
        description: 'Can read, download, write, and admin.'
    }
};

export const inviteStatusTypes = {
    PENDING: {
        value: 'pending',
        name: 'Pending'
    },
    ACCEPTED: {
        value: 'accepted',
        name: 'Accepted'
    },
    DECLINED: {
        value: 'declined',
        name: 'Declined'
    }
};

export const gitVersion = process.env.GIT_VERSION;
export const gitCommitHash = process.env.GIT_COMMIT_HASH;
export const gitBranch = process.env.GIT_BRANCH;

export const ckanApiBaseUrl = 'https://ckan.phc.sagesandbox.org/api/3';

export const models = {
    project: {
        name: {
            minlength: 3,
            maxlength: 64
        },
        description: {
            minlength: 0,
            maxlength: 1000 * 1024 * 1024
        },
        visibility: {
            values: ['Private', 'Public'],
            default: 'Private'
        }
    },
    message: {
        title: {
            minlength: 1,
            maxlength: 256,
        },
        body: {
            minlength: 26, // 1 character when stringifying Quill content
            maxlength: 1024 * 1024 // allows for 500 KB (Unicode: 1 character = 2 bytes)
        }
    },
    insight: {
        title: {
            minlength: 3,
            maxlength: 30
        },
        description: {
            minlength: 26, // 1 character when stringifying Quill content
            maxlength: 1024 * 1024 // allows for 500 KB (Unicode: 1 character = 2 bytes)
        },
        type: {
            values: ['report', 'memo'],
            default: 'report'
        }
    },
    resource: {
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
            maxlength: 1024
        }
    },
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
    contactUsUrl,
    userRoles,
    permissionTypes,
    gitVersion,
    gitCommitHash,
    gitBranch,
    models,
    datasetOrders,
    accessTypes,
    entityTypes,
    insightTypes,
    inviteStatusTypes
};
