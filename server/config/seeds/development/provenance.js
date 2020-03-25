import {
    adminUserId, testUserId
} from './users';

let activities = [
    {
        agents: [{
            userId: adminUserId,
            name: 'Admin',
            role: ''
        }],
        description: '',
        class: 'ToolSession',
        generated: [{
            name: 'PCA on TCGA breast cancer dataset',
            role: '',
            targetId: '5cb8de033f40db38a280a99e',
            targetVersionId: '1',
            class: 'Resource',
            subclass: 'State'
        }],
        name: 'FE-lite PCA',
        used: [
            {
                name: 'Admin Project',
                role: '',
                targetId: '5cb7acea2d718654d81bb97e',
                targetVersionId: '1',
                class: 'Project',
                subclass: 'Project'
            },
            {
                name: 'SBCP Shiny Tool Example',
                role: '',
                targetId: '5cb7acb3167e4f14b29dfb1b',
                targetVersionId: '1',
                class: 'Tool',
                subclass: 'Tool'
            },
            {
                name: 'TCGA BRCA Expression',
                role: '',
                targetId: 'resource0',
                targetVersionId: '1',
                class: 'Resource',
                subclass: 'File'
            },
        ]
    },
    {
        agents: [{
            userId: testUserId,
            name: 'Test User',
            role: ''
        }],
        description: '',
        class: 'ReportCreation',
        generated: [{
            name: 'Prognostic biomarkers are not necessarily strong cancer drivers',
            role: '',
            targetId: '5d40f40a0226447f14f07b98',
            targetVersionId: '1',
            class: 'Insight',
            subclass: 'Report'
        }],
        name: 'Prognostic biomarkers report',
        used: [
            {
                name: 'Test Project',
                role: '',
                targetId: '5cb7acea2d718614d81db97f',
                targetVersionId: '1',
                class: 'Project',
                subclass: 'Project'
            }
        ]
    },
    {
        agents: [{
            userId: adminUserId,
            name: 'Admin',
            role: ''
        }],
        description: '',
        class: 'ReportCreation',
        generated: [{
            name: 'Molecular charecteristics of NSCLC (TCGA)',
            role: '',
            targetId: '5d00229797146c78d42a33f4',
            targetVersionId: '1',
            class: 'Insight',
            subclass: 'Report'
        }],
        name: 'TCGA PCA Report',
        used: [
            {
                name: 'Admin Project',
                role: '',
                targetId: '5cb7acea2d718654d81bb97e',
                targetVersionId: '1',
                class: 'Project',
                subclass: 'Project'
            },
            {
                name: 'PCA on TCGA breast cancer dataset',
                role: '',
                targetId: '5cb8de033f40db38a280a99e',
                targetVersionId: '1',
                class: 'Resource',
                subclass: 'State'
            }
        ]
    },
    {
        agents: [{
            userId: adminUserId,
            name: 'Admin',
            role: ''
        }],
        description: '',
        class: 'ReportCreation',
        generated: [{
            name: 'Tissue-based classification of digital path slides in IMvigor study using python',
            role: '',
            targetId: '5d00229797146c78d42a33f3',
            targetVersionId: '1',
            class: 'Insight',
            subclass: 'Report'
        }],
        name: 'IMvigor Report',
        used: [
            {
                name: 'Admin Project',
                role: '',
                targetId: '5cb7acea2d718654d81bb97e',
                targetVersionId: '1',
                class: 'Project',
                subclass: 'Project'
            }
        ]
    },
    {
        agents: [{
            userId: adminUserId,
            name: 'Admin',
            role: ''
        }],
        description: '',
        class: 'ResourceRegistration',
        generated: [{
            name: 'Systematic identification of mutations and copy number alterations associated with cancer patient prognosis',
            role: '',
            targetId: '5d41074d1233ee2c08977867',
            targetVersionId: '1',
            class: 'Resource',
            subclass: 'Article'
        }],
        name: 'Creation of Article resource',
        used: [
            {
                name: 'Test Project',
                role: '',
                targetId: '5cb7acea2d718614d81db97f',
                targetVersionId: '1',
                class: 'Project',
                subclass: 'Project'
            }
        ]
    },
    {
        agents: [{
            userId: adminUserId,
            name: 'Admin',
            role: ''
        }],
        description: '',
        class: 'ResourceRegistration',
        generated: [{
            name: 'Flatiron Dashboard',
            role: '',
            targetId: '5d3fca86fdf2999583f5f5f5',
            targetVersionId: '1',
            class: 'Resource',
            subclass: 'Dashboard'
        }],
        name: 'Creation of Dashboard resource',
        used: [
            {
                name: 'Admin Project',
                role: '',
                targetId: '5cb7acea2d718654d81bb97e',
                targetVersionId: '1',
                class: 'Project',
                subclass: 'Project'
            }
        ]
    },
    {
        agents: [{
            userId: adminUserId,
            name: 'Admin',
            role: ''
        }],
        description: '',
        class: 'ResourceRegistration',
        generated: [{
            name: 'Defining the boundaries of a Healthy Immune Response',
            role: '',
            targetId: '5d4108cf0457c62e907aa7bd',
            targetVersionId: '1',
            class: 'Resource',
            subclass: 'WebApp'
        }],
        name: 'Creation of WebApp resource',
        used: [
            {
                name: 'Admin Project',
                role: '',
                targetId: '5cb7acea2d718654d81bb97e',
                targetVersionId: '1',
                class: 'Project',
                subclass: 'Project'
            }
        ]
    },
    {
        agents: [{
            userId: adminUserId,
            name: 'Admin',
            role: ''
        }],
        description: '',
        class: 'ResourceRegistration',
        generated: [{
            name: 'Urrutia et al., 2016, Cell Reports - Interactive Application',
            role: '',
            targetId: '5d410e5aa70c0435f1bf2218',
            targetVersionId: '1',
            class: 'Resource',
            subclass: 'WebApp'
        }],
        name: 'Creation of WebApp resource',
        used: [
            {
                name: 'Admin Project',
                role: '',
                targetId: '5cb7acea2d718654d81bb97e',
                targetVersionId: '1',
                class: 'Project',
                subclass: 'Project'
            }
        ]
    },
    {
        agents: [{
            userId: adminUserId,
            name: 'Admin',
            role: ''
        }],
        description: '',
        class: 'ResourceRegistration',
        generated: [{
            name: 'Milieu Interieur sjTREC Prediction Service',
            role: '',
            targetId: '5d410e5aa70c0435f1bf221a',
            targetVersionId: '1',
            class: 'Resource',
            subclass: 'WebApp'
        }],
        name: 'Creation of WebApp resource',
        used: [
            {
                name: 'Admin Project',
                role: '',
                targetId: '5cb7acea2d718654d81bb97e',
                targetVersionId: '1',
                class: 'Project',
                subclass: 'Project'
            }
        ]
    },
    {
        agents: [{
            userId: adminUserId,
            name: 'Admin',
            role: ''
        }],
        description: '',
        class: 'ResourceRegistration',
        generated: [{
            name: 'The human immune response and the impact of age, sex, and genetics',
            role: '',
            targetId: '5d410e5aa70c0435f1bf221b',
            targetVersionId: '1',
            class: 'Resource',
            subclass: 'WebApp'
        }],
        name: 'Creation of WebApp resource',
        used: [
            {
                name: 'Admin Project',
                role: '',
                targetId: '5cb7acea2d718654d81bb97e',
                targetVersionId: '1',
                class: 'Project',
                subclass: 'Project'
            }
        ]
    },
    {
        agents: [{
            userId: adminUserId,
            name: 'Admin',
            role: ''
        }],
        description: '',
        class: 'ResourceRegistration',
        generated: [{
            name: 'CRI iAtlas Portal',
            role: '',
            targetId: '5d41112036398539a1e71f17',
            targetVersionId: '1',
            class: 'Resource',
            subclass: 'WebApp'
        }],
        name: 'Creation of WebApp resource',
        used: [
            {
                name: 'Test Project',
                role: '',
                targetId: '5cb7acea2d718614d81db97f',
                targetVersionId: '1',
                class: 'Project',
                subclass: 'Project'
            }
        ]
    },
    {
        agents: [{
            userId: adminUserId,
            name: 'Admin',
            role: ''
        }],
        description: '',
        class: 'ResourceRegistration',
        generated: [{
            name: 'Oncoscape',
            role: '',
            targetId: '5d41112036398539a1e71f18',
            targetVersionId: '1',
            class: 'Resource',
            subclass: 'WebApp'
        }],
        name: 'Creation of WebApp resource',
        used: [
            {
                name: 'Test Project',
                role: '',
                targetId: '5cb7acea2d718614d81db97f',
                targetVersionId: '1',
                class: 'Project',
                subclass: 'Project'
            }
        ]
    }
];

export {
    activities
};
