/*eslint no-process-env:0*/

export const env = process.env.NODE_ENV;
export const port = process.env.PORT || 9000;
export const contactUsUrl = process.env.CONTACT_US_URL || 'https://webforms.roche.com/phcixcc';
// export const contactUsUrl = process.env.CONTACT_US_URL || 'https://sagebionetworks.org';

export const userRoles = {
    USER: {
        value: 'User',
    },
    ADMIN: {
        value: 'Admin',
    },
};

export const actionPermissionTypes = {
    CREATE_PROJECT: {
        value: 'CreateProject',
    },
    CREATE_DATA_CATALOG: {
        value: 'CreateDataCatalog',
    },
    CREATE_TOOL: {
        value: 'CreateTool',
    },
    CREATE_ORGANIZATION: {
        value: 'CreateOrganization'
    },
    CREATE_USER: {
        value: 'CreateUser'
    }
};

export const entityTypes = {
    APP: {
        value: 'App',
    },
    PROJECT: {
        value: 'Project',
    },
    DATA_CATALOG: {
        value: 'DataCatalog',
    },
    INSIGHT: {
        value: 'Insight'
    },
    RESOURCE: {
        value: 'Resource'
    },
    TOOL: {
        value: 'Tool',
    },
    ORGANIZATION: {
        value: 'Organization'
    }
};

export const notificationTypes = {
    ENTITY_ACCESS_NOTIFICATION: {
        value: 'EntityAccessNotification'
    },
    ENTITY_NOTIFICATION: {
        value: 'EntityNotification'
    },
    MESSAGE_NOTIFICATION: {
        value: 'MessageNotification'
    },
};
export const entityAttachmentTypes = [
    { type: '-- Add an attachment --', collection: '' },
    { type: 'Article', collection: 'resources' },
    { type: 'Dashboard', collection: 'resources' },
    { type: 'Memo', collection: 'insights' },
    { type: 'Report', collection: 'insights' },
    { type: 'State', collection: 'resources' },
    { type: 'WebApp', collection: 'resources' },
];

export const insightTypes = {
    REPORT: {
        value: 'Report',
        name: 'Report',
    },
    MEMO: {
        value: 'Memo',
        name: 'Memo',
    },
};

export const resourceTypes = {
    ARTICLE: {
        value: 'Article',
        name: 'Article',
    },
    DASHBOARD: {
        value: 'Dashboard',
        name: 'Dashboard',
    },
    STATE: {
        value: 'State',
        name: 'State',
    },
    WEBAPP: {
        value: 'WebApp',
        name: 'WebApp',
    },
};
export const activityTypes = {
    RESOURCEGENERATION: {
        value: 'Resource generation',
        name: 'Resouce generation',
    },
    MEMOIZATION: {
        value: 'Memoization',
        name: 'Memoization',
    },
    MENTION: {
        value: 'Mention',
        name: 'Mention',
    },
    TOOLSESSION: {
        value: 'Tool session',
        name: 'Tool session',
    },
};

export const accessTypes = {
    READ: {
        value: 'Read',
        name: 'Read',
        description: 'Can read and download.',
    },
    WRITE: {
        value: 'Write',
        name: 'Write',
        description: 'Can read, download, and write.',
    },
    ADMIN: {
        value: 'Admin',
        name: 'Admin',
        description: 'Can read, download, write, and admin.',
    },
};

export const inviteStatusTypes = {
    PENDING: {
        value: 'Pending',
        name: 'Pending',
    },
    ACCEPTED: {
        value: 'Accepted',
        name: 'Accepted',
    },
    DECLINED: {
        value: 'Declined',
        name: 'Declined',
    },
};

export const dataCatalogApiTypes = {
    CKAN: {
        value: 'Ckan',
        name: 'CKAN',
    },
};

export const gitVersion = process.env.GIT_VERSION;
export const gitCommitHash = process.env.GIT_COMMIT_HASH;
export const gitBranch = process.env.GIT_BRANCH;

export const ckanApiBaseUrl = 'https://ckan.phc.sagesandbox.org/api/3';

// TODO: replace with tool service query
export const defaultTools = [
    {
        value: '5cb6a048e7bdc7740874fd93',
        name: 'Facile Explorer',
    },
    {
        value: '5cb6a048e7bdc7740874fd95',
        name: 'IRIS Enterprise Explorer',
    },
    {
        value: '5cb6a048e7bdc7740874fd98',
        name: 'PHC Advanced Analytics',
    },
    {
        value: '5cb7acb3167e4f14b29dfb1b',
        name: 'PHCCP Shiny Tool Example',
    },
];

export const entityVisibility = {
    PUBLIC: {
        value: 'Public',
        name: 'Public',
    },
    PRIVATE: {
        value: 'Private',
        name: 'Private',
    },
};

export const models = {
    app: {
        title: {
            minlength: 3,
            maxlength: 128,
        },
        description: {
            minlength: 0,
            maxlength: 1000 * 1024 * 1024,
        },
        picture: {
            default: 'https://via.placeholder.com/200/495a63/495a63',
        },
        visibility: {
            options: [entityVisibility.PUBLIC],
            default: entityVisibility.PUBLIC,
        },
    },
    project: {
        title: {
            minlength: 3,
            maxlength: 128,
        },
        description: {
            minlength: 0,
            maxlength: 1000 * 1024 * 1024,
        },
        picture: {
            default: 'https://via.placeholder.com/200/50c878/50c878',
        },
        visibility: {
            options: Object.values(entityVisibility),
            default: entityVisibility.PRIVATE,
        },
    },
    dataCatalog: {
        title: {
            minlength: 3,
            maxlength: 128,
        },
        description: {
            minlength: 3,
            maxlength: 1024,
        },
        picture: {
            default: 'https://via.placeholder.com/200/8a2be2/8a2be2',
        },
        visibility: {
            options: [entityVisibility.PUBLIC], // Object.values(entityVisibility)
            default: entityVisibility.PUBLIC, // entityVisibility.PRIVATE
        },
        apiType: {
            options: Object.values(dataCatalogApiTypes),
            default: dataCatalogApiTypes.CKAN,
        },
    },
    tool: {
        title: {
            minlength: 3,
            maxlength: 128,
        },
        description: {
            minlength: 3,
            maxlength: 1024,
        },
        picture: {
            default: 'https://via.placeholder.com/200/007fff/007fff',
        },
        visibility: {
            options: [entityVisibility.PUBLIC], // Object.values(entityVisibility)
            default: entityVisibility.PUBLIC, // entityVisibility.PRIVATE
        },
    },
    share: {
        invitedUsers: {
            minlength: 1
        },
        comment: {
            minlength: 1,
            maxlength: 1024
        },
    },
    resource: {
        title: {
            minlength: 3,
            maxlength: 128,
        },
        description: {
            minlength: 26, // 1 character when stringifying Quill content
            maxlength: 1024 * 1024, // allows for 500 KB (Unicode: 1 character = 2 bytes)
        },
        picture: {
            default: 'https://via.placeholder.com/200/ffbcd9/ffbcd9',
        },
        visibility: {
            options: Object.values(entityVisibility),
            default: entityVisibility.PRIVATE,
        },
        type: {
            options: Object.values(resourceTypes),
            default: resourceTypes.ARTICLE,
        },
        url: {
            minlength: 10,
            maxlength: 2000,
        },
    },
    insight: {
        title: {
            minlength: 3,
            maxlength: 128,
        },
        description: {
            minlength: 26, // 1 character when stringifying Quill content
            maxlength: 1024 * 1024, // allows for 500 KB (Unicode: 1 character = 2 bytes)
        },
        picture: {
            default: 'https://via.placeholder.com/200/ffbf00/ffbf00',
        },
        visibility: {
            options: Object.values(entityVisibility),
            default: entityVisibility.PRIVATE,
        },
        type: {
            options: Object.values(insightTypes),
            default: insightTypes.REPORT,
        },
    },
    message: {
        title: {
            minlength: 1,
            maxlength: 256,
        },
        body: {
            minlength: 26, // 1 character when stringifying Quill content
            maxlength: 1024 * 1024, // allows for 500 KB (Unicode: 1 character = 2 bytes)
        },
    },
    activity: {
        title: {
            minlength: 3,
            maxlength: 30,
        },
        description: {
            minlength: 26, // 1 character when stringifying Quill content
            maxlength: 1024 * 1024, // allows for 500 KB (Unicode: 1 character = 2 bytes)
        },
        type: {
            values: ['Report generation', 'Memoization', 'Mention', 'Tool session'],
            default: 'Report generation',
        },
        url: {
            minlength: 10,
            maxlength: 2000,
        },
    },
    user: {
        // title: {
        //     minlength: 3,
        //     maxlength: 128,
        // },
        picture: {
            default: '',
        },
        role: {
            options: Object.values(userRoles),
            default: userRoles.USER,
        },
    },
    organization: {
        title: {
            minlength: 3,
            maxlength: 128,
        },
        description: {
            minlength: 3,
            maxlength: 256,
        },
        picture: {
            default: 'https://via.placeholder.com/200/b2ffff/b2ffff',
        },
        visibility: {
            options: [entityVisibility.PUBLIC], // Object.values(entityVisibility)
            default: entityVisibility.PUBLIC, // entityVisibility.PRIVATE
        },
    },
};

// FILTERS USED IN BOTH SERVER AND CLIENT SIDE

export const datasetOrders = {
    // ALPHA: {  // Sorting by title doesn't seem to work
    //     value: 'title asc',
    //     title: 'Alphabetical',
    //     active: true
    // },
    RELEVANCE: {
        value: 'relevance asc',
        title: 'Relevance',
        active: true,
    },
    NEWEST: {
        value: 'metadata_created desc',
        title: 'Newest Datasets',
    },
    OLDEST: {
        value: 'metadata_created asc',
        title: 'Oldest Datasets',
    },
};

export const insightTypeFilters = [
    {
        value: insightTypes.REPORT.value,
        title: insightTypes.REPORT.name,
        active: true,
    },
    {
        value: insightTypes.MEMO.value,
        title: insightTypes.MEMO.name,
    },
];

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
    accessTypes,
    entityTypes,
    notificationTypes,
    insightTypes,
    resourceTypes,
    inviteStatusTypes,
    entityVisibility,
    dataCatalogApiTypes,

    datasetOrders,
    insightTypeFilters
};
