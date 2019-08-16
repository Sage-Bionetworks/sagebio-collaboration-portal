import mongoose from 'mongoose';
import {
    adminUserId
} from '../default/users';
import {
    testProjectId,
    anotherProjectId
} from './projects.js';

let webapps = [{
    _id: new mongoose.Types.ObjectId('5d4108cf0457c62e907aa7bd'),
    title: 'Defining the boundaries of a Healthy Immune Response',
    description: `{\"ops\":[{\"insert\":\"Functional analysis via standardized whole-blood stimulation systems defines the boundaries of a healthy immune response to complex stimuli.\\n\\n\"}]}`,
    url: 'http://104.236.137.56:3838/ImmunityDuffy2014/',
    projectId: testProjectId,
    createdBy: adminUserId
},
{
    _id: new mongoose.Types.ObjectId('5d410e5aa70c0435f1bf2218'),
    title: 'Urrutia et al., 2016, Cell Reports - Interactive Application',
    description: `{\"ops\":[{\"insert\":\"Standardized whole-blood transcriptional profiling enables the deconvolution of complex induced immune responses.\\n\\n\"}]}`,
    url: 'https://www.synapse.org/#!Synapse:syn7059574',
    projectId: testProjectId,
    createdBy: adminUserId
},
{
    _id: new mongoose.Types.ObjectId('5d410e5aa70c0435f1bf2219'),
    title: 'non-genetic and genetic determinants of immune cell parameters in 1,000 healthy subjects',
    description: `{\"ops\":[{\"insert\":\"Visualize the non-genetic and genetic determinants of immune cell parameters in our cohort (a companion Shiny application from Patin, Hasan, Bergstedt et al., Nat Immunol 2018).\\n\\n\"}]}`,
    url: 'https://www.synapse.org/#!Synapse:syn7059574',
    projectId: testProjectId
},
{
    _id: new mongoose.Types.ObjectId('5d410e5aa70c0435f1bf221a'),
    title: 'Milieu Interieur sjTREC Prediction Service',
    description: `{\"ops\":[{\"insert\":\"Predict sjTREC levels based on an individual's age, gender, and genotype through the Milieu Interieur sjTREC Prediction Service (a Shiny application from Clave et al., Sci Trans Med, 2018).\\n\\n\"}]}`,
    url: 'https://mithymus.pasteur.fr/',
    projectId: testProjectId,
    createdBy: adminUserId
},
{
    _id: new mongoose.Types.ObjectId('5d410e5aa70c0435f1bf221b'),
    title: 'The human immune response and the impact of age, sex, and genetics',
    description: `{\"ops\":[{\"insert\":\"Explore the impact of age, sex and genetics on the human immune response (from Piasecka and Duffy et al., PNAS, 2017).\\n\\n\"}]}`,
    url: 'http://misage.pasteur.fr/',
    projectId: testProjectId,
    createdBy: adminUserId
},
{
    _id: new mongoose.Types.ObjectId('5d41112036398539a1e71f17'),
    title: 'CRI iAtlas Portal',
    description: `{\"ops\":[{\"insert\":\"The Cancer Research Institute (CRI) iAtlas is an interactive web-based platform and set of analytic tools for studying interactions between tumors and the immune microenvironment. These tools allow researchers to explore associations among a variety of immune characterizations as well as with genomic and clinical phenotypes. The initial version of CRI iAtlas is based on an analysis performed by The Cancer Genome Atlas (TCGA) Research Network on the TCGA data set comprising over 10,000 tumor samples and 33 tumor types (Thorsson et al. Immunity, 2018).\\n\\n\"}]}`,
    url: 'https://isb-cgc.shinyapps.io/shiny-iatlas/',
    projectId: anotherProjectId,
    createdBy: adminUserId
},
{
    _id: new mongoose.Types.ObjectId('5d41112036398539a1e71f18'),
    title: 'Oncoscape',
    description: `{\"ops\":[{\"insert\":\"Oncoscape provides data-visualization and exploratory data analysis on both molecular and clinical cancer data.\\n\\n\"}]}`,
    url: 'https://oncoscape.sttrcancer.org/#/',
    projectId: anotherProjectId,
    createdBy: adminUserId
}];

export {
    webapps
};
