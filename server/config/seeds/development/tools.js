import mongoose from 'mongoose';
import { sageId, geneId } from './organizations';

let tools = [{
    _id: '5cb6a048e7bdc7740874fd93',
    name: 'Facile Explorer',
    description: 'Add description',
    picture: 'assets/images/320px-shinyLogo.png',
    website: '5cb6a048e7bdc7740874fd94',
    apiServerUrl: '',
    organization: geneId
}, {
    _id: '',
    name: 'FE Lite',
    description: 'Add description',
    picture: 'assets/images/320px-shinyLogo.png',
    website: '',
    apiServerUrl: '',
    organization: sageId
}, {
    _id: '5cb6a048e7bdc7740874fd95',
    name: 'IRIS Image Explorer',
    description: 'Missing description',
    picture: 'assets/images/320px-IRIS-Enterprise-Explorer.png',
    website: 'https://iris-e-explorer.navify.com',
    apiServerUrl: '',
    organization: geneId
}, {
    _id: '5cb6a048e7bdc7740874fd96',
    name: 'RStudio',
    description: `RStudio is a free and open-source integrated development
        environment for R, a programming language for statistical computing
        and graphics.`,
    picture: 'assets/images/320px-RStudio-Logo.png',
    website: 'https://www.rstudio.com',
    apiServerUrl: '',
    organization: geneId
}, {
    _id: '5cb6a048e7bdc7740874fd97',
    name: 'Jupyter',
    description: `Project Jupyter exists to develop open-source software,
        open-standards, and services for interactive computing across dozens
        of programming languages.`,
    picture: 'assets/images/320px-Jupyter_logo.svg.png',
    website: 'https://jupyter.org',
    apiServerUrl: '',
    organization: geneId
}, {
    _id: '5cb6a048e7bdc7740874fd98',
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
