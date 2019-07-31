import mongoose from 'mongoose';
import {
    adminUserId
} from './users';
import {
    testProjectId
} from './projects.js';

const memo1Id = new mongoose.Types.ObjectId('5d00229797546c78d42a33f4');

let memos = [{
        _id: memo1Id,
        title: 'Memo: Molecular charecteristics of NSCLC (TCGA)',
        // description: `{\"ops\":[{\"insert\":\"var a = 1;\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"}]}`,
        description: `{\"ops\":[{\"insert\":\"For full paper, please see \"},{\"attributes\":{\"link\":\"https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4277914/\"},\"insert\":\"this manuscript\"},{\"insert\":\".\\n\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Molecular characteristics of non small cell lung cancer with reduced CHFR expression in The Cancer Genome Atlas (TCGA) project\"},{\"insert\":\"\\n\\nOf note:\\n\\nThe relationship between reduced CHFR expression and male gender in patients with squamous cell carcinomas is interesting and deserves further explanation. A previous study reported that CHFR expression is particularly impaired in smoking related squamous cell carcinoma of the lung. Even though data about past, present or never smoking status are available in TCGA, detailed information about the cumulative amount of cigarettes smoked is not. It is therefore possible that the gender specific differences are at least in part due to differences in smoking patterns.\\n\"}]}`,
        projectId: testProjectId,
        createdBy: adminUserId,
        insightType: 'memo'
    }
];

export {
    memos
};
