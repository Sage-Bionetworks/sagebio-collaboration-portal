import mongoose from 'mongoose';
import { sageId, geneId } from './organizations';

let tools = [{
    _id: new mongoose.Types.ObjectId(),
    name: 'Facile Explorer',
    description: 'Add description',
    picture: 'assets/images/320px-shinyLogo.png',
    website: '',
    apiServerUrl: '',
    organization: geneId
}, {
    _id: new mongoose.Types.ObjectId(),
    name: 'FE Lite',
    description: 'Add description',
    picture: 'assets/images/320px-shinyLogo.png',
    website: '',
    apiServerUrl: '',
    organization: sageId
}, {
    _id: new mongoose.Types.ObjectId(),
    name: 'IRIS Image Explorer',
    description: 'Missing description',
    picture: 'assets/images/320px-IRIS-Enterprise-Explorer.png',
    website: 'https://iris-e-explorer.navify.com',
    apiServerUrl: '',
    organization: geneId
}, {
    _id: new mongoose.Types.ObjectId(),
    name: 'RStudio',
    description: `RStudio is a free and open-source integrated development
        environment for R, a programming language for statistical computing
        and graphics.`,
    picture: 'assets/images/320px-RStudio-Logo.png',
    website: 'https://www.rstudio.com',
    apiServerUrl: '',
    organization: geneId
}, {
    _id: new mongoose.Types.ObjectId(),
    name: 'Jupyter',
    description: `Project Jupyter exists to develop open-source software,
        open-standards, and services for interactive computing across dozens
        of programming languages.`,
    picture: 'assets/images/320px-Jupyter_logo.svg.png',
    website: 'https://jupyter.org',
    apiServerUrl: '',
    organization: geneId
}, {
    _id: new mongoose.Types.ObjectId(),
    name: 'PHC Advanced Analytics',
    description: 'Add description',
    picture: 'assets/images/320px-Roche_Logo.svg.png',
    website: '',
    apiServerUrl: '',
    organization: geneId
}];

export {
    tools
};
