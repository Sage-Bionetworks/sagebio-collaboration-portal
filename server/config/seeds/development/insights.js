import mongoose from 'mongoose';

const insight1Id = new mongoose.Types.ObjectId('5d00229797146c78d42a33f4');
const insight2Id = new mongoose.Types.ObjectId('5d00229797146c78d42a33f3');

let insights = [{
    _id: insight1Id,
    name: 'Molecular charecteristics of NSCLC (TCGA)',
    description: `{\"ops\":[{\"insert\":\"For full paper, please see \"},{\"attributes\":{\"link\":\"https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4277914/\"},\"insert\":\"this manuscript\"},{\"insert\":\".\\n\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Molecular characteristics of non small cell lung cancer with reduced CHFR expression in The Cancer Genome Atlas (TCGA) project\"},{\"insert\":\"\\n\\nOf note:\\n\\nThe relationship between reduced CHFR expression and male gender in patients with squamous cell carcinomas is interesting and deserves further explanation. A previous study reported that CHFR expression is particularly impaired in smoking related squamous cell carcinoma of the lung. Even though data about past, present or never smoking status are available in TCGA, detailed information about the cumulative amount of cigarettes smoked is not. It is therefore possible that the gender specific differences are at least in part due to differences in smoking patterns.\\n\"}]}`,
}, {
    _id: insight2Id,
    name: 'Tissue-based classification of digital path slides in IMvigor study using python',
    description: `{\"ops\":[{\"insert\":\"Tools\"},{\"attributes\":{\"header\":1},\"insert\":\"\\n\"},{\"insert\":\"\\n- IRISe v1.1\\n- Python v3.6.6\\n\\nDeveloped a novel deep-learning algorithm to classify different tissues in slides for the IMvigor study. Currently in validation stage where we will compare the algorithm's results to that of several clinicians.\\n\\nMethods\"},{\"attributes\":{\"header\":1},\"insert\":\"\\n\"},{\"insert\":\"\\nAdapted from \"},{\"attributes\":{\"link\":\"http://www.jpathinformatics.org/article.asp?issn=2153-3539;year=2016;volume=7;issue=1;spage=29;epage=29;aulast=Janowczyk;t=6\"},\"insert\":\"this article\"},{\"insert\":\": Per image, we randomly select a number of pixels (e.g., 15,000) belonging to both classes to act as training samples, and compute a limited set of texture features (i.e., contrast, correlation, energy, and homogeneity). [ ….] Next, we use a naïve Bayesian classifier to determine posterior probabilities of class membership for all the pixels in the image.\\n\"}]}`
}];

export {
    insights
};
