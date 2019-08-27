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
    APP: {
        value: 'app'
    },
    PROJECT: {
        value: 'project'
    },
    TOOL: {
        value: 'tool'
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

export const resourceTypes = {
    DASHBOARD: {
        value: 'Dashboard',
        name: 'Dashboard'
    },
    STATE: {
        value: 'State',
        name: 'State'
    },
    WEBAPP: {
        value: 'WebApp',
        name: 'WebApp'
    },
    ARTICLE: {
        value: 'Article',
        name: 'Article'
    }
}
;
export const activityTypes = {
    RESOURCEGENERATION: {
        value: 'Resource generation',
        name: 'Resouce generation'
    },
    MEMOIZATION: {
        value: 'Memoization',
        name: 'Memoization'
    },
    MENTION: {
        value: 'Mention',
        name: 'Mention'
    },
    TOOLSESSION: {
        value: 'Tool session',
        name: 'Tool session'
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

// TODO: replace with tool service query
export const defaultTools = [
    {
        value: '5cb6a048e7bdc7740874fd93',
        name: 'Facile Explorer'
    }, {
        value: '5cb6a048e7bdc7740874fd95',
        name: 'IRIS Enterprise Explorer'
    }, {
        value: '5cb6a048e7bdc7740874fd98',
        name: 'PHC Advanced Analytics'
    }, {
        value: '5cb7acb3167e4f14b29dfb1b',
        name: 'PHCCP Shiny Tool Example'
    }
];

export const entityVisibility = {
    PUBLIC: {
        value: 'Public'
    },
    PRIVATE: {
        value: 'Private'
    }
};

export const models = {
    project: {
        title: {
            minlength: 3,
            maxlength: 64
        },
        description: {
            minlength: 0,
            maxlength: 1000 * 1024 * 1024
        },
        visibility: {
            values: Object.values(entityVisibility).map(visibility => visibility.value),
            default: entityVisibility.PRIVATE.value
        }
        // visibility: {
        //     values: ['Private', 'Public'],
        //     default: 'Private'
        // }
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
        title: {
            minlength: 3,
            maxlength: 30
        },
        description: {
            minlength: 26, // 1 character when stringifying Quill content
            maxlength: 1024 * 1024 // allows for 500 KB (Unicode: 1 character = 2 bytes)
        },
        type: {
            values: ['Dashboard', 'State', 'WebApp', 'Article'],
            default: 'Dashboard'
        },
        url: {
            minlength: 10,
            maxlength: 2000
        }
    },
    activity: {
        title: {
            minlength: 3,
            maxlength: 30
        },
        description: {
            minlength: 26, // 1 character when stringifying Quill content
            maxlength: 1024 * 1024 // allows for 500 KB (Unicode: 1 character = 2 bytes)
        },
        type: {
            values: ['Report generation', 'Memoization', 'Mention', 'Tool session'],
            default: 'Report generation'
        },
        url: {
            minlength: 10,
            maxlength: 2000
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
    defaultTools,
    models,
    datasetOrders,
    accessTypes,
    entityTypes,
    insightTypes,
    resourceTypes,
    inviteStatusTypes,
    entityVisibility
};
