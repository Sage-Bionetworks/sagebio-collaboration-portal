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

export const actionPermissionTypes = {
    CREATE_PROJECT: {
        value: 'CreateProject'
    },
    CREATE_DATA_CATALOG: {
        value: 'CreateDataCatalog'
    },
    CREATE_TOOL: {
        value: 'CreateTool'
    }
};

export const entityTypes = {
    APP: {
        value: 'app' // TODO Capitalize
    },
    PROJECT: {
        value: 'project'
    },
    DATA_CATALOG: {
        value: 'data-catalog'
    },
    TOOL: {
        value: 'tool'
    }
};

export const insightTypes = {
    REPORT: {
        value: 'report', // TODO Capitalize
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

export const dataCatalogApiTypes = {
    CKAN: {
        value: 'Ckan',
        name: 'CKAN'
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
        value: 'Public',
        name: 'Public'
    },
    PRIVATE: {
        value: 'Private',
        name: 'Private'
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
        picture: {
            default: 'https://via.placeholder.com/200/50c878/50c878'
        },
        visibility: {
            options: Object.values(entityVisibility),
            default: entityVisibility.PRIVATE
        }
    },
    dataCatalog: {
        title: {
            minlength: 3,
            maxlength: 30
        },
        description: {
            minlength: 3,
            maxlength: 1024
        },
        picture: {
            default: 'https://via.placeholder.com/200/8a2be2/8a2be2'
        },
        visibility: {
            options: [entityVisibility.PUBLIC], // Object.values(entityVisibility)
            default: entityVisibility.PUBLIC // entityVisibility.PRIVATE
        },
        apiType: {
            options: Object.values(dataCatalogApiTypes),
            default: dataCatalogApiTypes.CKAN
        }
    },
    tool: {
        title: {
            minlength: 3,
            maxlength: 30
        },
        description: {
            minlength: 3,
            maxlength: 1024
        },
        picture: {
            default: 'https://via.placeholder.com/200/007fff/007fff'
        },
        visibility: {
            options: [entityVisibility.PUBLIC], // Object.values(entityVisibility)
            default: entityVisibility.PUBLIC // entityVisibility.PRIVATE
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
        visibility: {
            values: Object.values(entityVisibility).map(visibility => visibility.value),
            default: entityVisibility.PRIVATE.value
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
        visibility: {
            values: Object.values(entityVisibility).map(visibility => visibility.value),
            default: entityVisibility.PRIVATE.value
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
    contactUsUrl,
    userRoles,
    actionPermissionTypes,
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
    entityVisibility,
    dataCatalogApiTypes
};
