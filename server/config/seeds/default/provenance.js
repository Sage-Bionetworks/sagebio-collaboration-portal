import {
    adminUserId
} from './constants';

let activities = [
    {
        'agents': [{
            'userId': adminUserId,
            'name': 'Admin',
            'role': ''
        }],
        'description': '',
        'class': 'Tool session',
        'generated': [{
            'name': 'PCA on TCGA breast cancer dataset',
            'role': '',
            'targetId': '5cb8de033f40db38a280a99e',
            'targetVersionId': '1',
            'class': 'Resource',
            'subclass': 'State'
        }],
        'name': 'FE Lite PCA',
        'used': [{
            'name': 'FE Lite',
            'role': '',
            'targetId': 'FELiteID',
            'targetVersionId': '1',
            'class': 'Tool',
            'subclass': 'Tool'
        }]
    },
    {
        'agents': [{
            'userId': 'AdminID',
            'name': 'Admin',
            'role': ''
        }],
        'description': '',
        'class': 'Report generation',
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
