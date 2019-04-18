import mongoose from 'mongoose';
import { sageId, geneId } from './organizations';

let tools = [{
    _id: '5cb6a048e7bdc7740874fd93',
    name: 'Facile Explorer',
    description: `A Shiny App for self-service and exploratory analytics.
        It empowers users to compute over data and is designed to enable
        sustained independent data exploration. The FacileData ecosystem was
        designed to support exploration of clinical trial data and facilitate
        communication between bench and computational scientists to accelerate
        discovery.`,
    picture: 'assets/images/320px-shinyLogo.png',
    website: '5cb6a048e7bdc7740874fd94',
    apiServerUrl: '',
    resourceFormats: [],
    organization: geneId
}, {
    _id: '5cb7acb3167e4f14b29dfb1b',
    name: 'FE Lite',
    description: `A Shiny App for demonstrating features of this collaboration
        portal.`,
    picture: 'assets/images/320px-shinyLogo.png',
    website: '',
    apiServerUrl: '',
    resourceFormats: ['CSV', 'JSON', 'plain text'],
    organization: sageId
}, {
    _id: '5cb6a048e7bdc7740874fd95',
    name: 'IRIS Enterprise Explorer',
    description: `IRIS Enterprise (IRISe) is a scalable cloud-based solution
        designed to aggregate digital pathology images and derived
        high-dimensional biomarker data collected in cancer immunotherapy
        trials across Roche Pharma. It aims to assist pathologists and
        biomarker scientists within Roche by providing visualized, contextual
        insights into cancer and immune biology, and the mechanism of action of
        new cancer treatments.`,
    picture: 'assets/images/320px-IRIS-Enterprise-Explorer.png',
    website: 'https://iris-e-explorer.navify.com',
    apiServerUrl: '',
    resourceFormats: [],
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
    resourceFormats: [],
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
    resourceFormats: [],
    organization: geneId
}, {
    _id: '5cb6a048e7bdc7740874fd98',
    name: 'PHC Advanced Analytics',
    description: `PHC Advanced Analytics Platform is a scalable analytics
        platform allowing users (Data Scientists, Clinical/Statistical
        Programmers, Statisticians and Epidemiologists) to establish their own
        baseline analytics environments ("containers"). The containerized,
        cloud-based environments provide a collection of statistical
        programming and data visualization tools to support advanced analytic
        tools (RStudio Pro, RSConnect, Jupyter).`,
    picture: 'assets/images/320px-PHC_IX.png',
    website: '',
    apiServerUrl: '',
    resourceFormats: [],
    organization: geneId
}];

export {
    tools
};
