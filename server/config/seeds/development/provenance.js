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
                name: 'PHCCP Shiny Tool Example',
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
    }
];

export {
    activities
};
