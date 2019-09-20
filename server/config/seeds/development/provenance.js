import {
    adminUserId
} from '../default/constants';

let activities = [
    {
        'agents': [{
            'userId': adminUserId,
            'name': 'Admin',
            'role': ''
        }],
        'description': '',
        'class': 'ToolSession',
        'generated': [{
            'name': 'PCA on TCGA breast cancer dataset',
            'role': '',
            'targetId': '5cb8de033f40db38a280a99e',
            'targetVersionId': '1',
            'class': 'Resource',
            'subclass': 'State'
        }],
        'name': 'FE-lite PCA',
        'used': [
            {
                'name': 'PHCCP Shiny Tool Example',
                'role': '',
                'targetId': '5cb7acb3167e4f14b29dfb1b',
                'targetVersionId': '1',
                'class': 'Tool',
                'subclass': 'Tool'
            },
            {
                'name': 'TCGA BRCA Expression',
                'role': '',
                'targetId': 'resource0',
                'targetVersionId': '1',
                'class': 'Resource',
                'subclass': 'File'
            },
        ]
    },
    {
        'agents': [{
            'userId': adminUserId,
            'name': 'Admin',
            'role': ''
        }],
        'description': '',
        'class': 'ReportGeneration',
        'generated': [{
            'name': 'Molecular charecteristics of NSCLC (TCGA)',
            'role': '',
            'targetId': '5d00229797146c78d42a33f4',
            'targetVersionId': '1',
            'class': 'Insight',
            'subclass': 'Report'
        }],
        'name': 'TCGA PCA Report',
        'used': [{
            'name': 'PCA on TCGA breast cancer dataset',
            'role': '',
            'targetId': '5cb8de033f40db38a280a99e',
            'targetVersionId': '1',
            'class': 'Resource',
            'subclass': 'State'
        }]
    }
]

export {
    activities
};
