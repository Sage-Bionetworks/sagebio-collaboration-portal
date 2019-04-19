import mongoose from 'mongoose';

let insights = [{
    _id: new mongoose.Types.ObjectId(),
    name: 'IMolecular charecteristics of NSCLC (TCGA)',
    description: `For full paper, please see [this manuscript](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4277914/).

#### Molecular characteristics of non small cell lung cancer with reduced CHFR expression in The Cancer Genome Atlas (TCGA) project

**Of note**:

The relationship between reduced CHFR expression and male gender in patients with squamous cell carcinomas is interesting and deserves further explanation. A previous study reported that CHFR expression is particularly impaired in smoking related squamous cell carcinoma of the lung. Even though data about past, present or never smoking status are available in TCGA, detailed information about the cumulative amount of cigarettes smoked is not. It is therefore possible that the gender specific differences are at least in part due to differences in smoking patterns.`
}, {
    _id: new mongoose.Types.ObjectId(),
    name: 'Tissue-based classification of digital path slides in IMvigor study using python',
    description: `**Tools**:
- IRISe v1.1
- Python v3.6.6

Developed a novel deep-learning algorithm to classify different tissues in slides for the IMvigor study. Currently in validation stage where we will compare the algorithm's results to that of several clinicians. `
}];

export {
    insights
};
