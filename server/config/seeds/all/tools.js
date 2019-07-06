import mongoose from 'mongoose';
import { sageId, geneId } from './organizations';
import { adminUserId } from './users';
import config from '../../environment';

let tools = [{
    _id: new mongoose.Types.ObjectId('5cb6a048e7bdc7740874fd93'),
    slug: 'facile-explorer',
    name: 'Facile Explorer',
    description: `A Shiny App for self-service and exploratory analytics.
        It empowers users to compute over data and is designed to enable
        sustained independent data exploration. The FacileData ecosystem was
        designed to support exploration of clinical trial data and facilitate
        communication between bench and computational scientists to accelerate
        discovery.`,
    picture: 'assets/images/320px-shinyLogo.png',
    website: 'http://gred-shiny-p01.sc1.roche.com:3838/facileexplorer/?activeFDS=FacileAtezoDataSet%20v0.7.8',  // 'http://gred-shiny-p01.sc1.roche.com:3838/facileexplorer',
    apiServerUrl: 'plop',
    apiHealthCheckUrl: 'plop',
    resourceFormats: [],
    organization: geneId,
    createdBy: adminUserId
},
// {
//     _id: '5cb6a048e7bdc7740874fe42',
//     name: 'TCGA Shiny',
//     description: `An R Shiny app to explore data from The Cancer Genome Atlas
//         (TCGA). The data used has been processed with scripts from
//         https://github.com/arnijohnsen/tcga-analysis`,
//     picture: 'assets/images/320px-shinyLogo.png',
//     website: 'http://gred-shiny-p01.sc1.roche.com:3838/facileexplorer',
//     apiServerUrl: 'http://gred-shiny-p01.sc1.roche.com:3838/facileexplorer',
//     resourceFormats: ['CSV', 'JSON', 'plain text', 'TXT'],
//     organization: geneId
// },
{
    _id: new mongoose.Types.ObjectId('5cb7acb3167e4f14b29dfb1b'),
    name: 'PHCCP Shiny Tool Example',
    slug: 'phccp-shiny-tool-example',
    description: `A Shiny App for demonstrating features of this collaboration
        portal.`,
    picture: 'assets/images/320px-shinyLogo.png',
    // TODO: change website to the domain name running FE Lite.
    // If FE Lite is run as part of the portal stack, keep port 8082 as it is where FE Lite is listening
    website: config.phccpShinyToolExample.url,
    apiServerUrl: 'TBA',
    apiHealthCheckUrl: 'plop',
    resourceFormats: ['CSV', 'JSON', 'plain text', 'TXT'],
    organization: sageId,
    createdBy: adminUserId
}, {
    _id: new mongoose.Types.ObjectId('5cb6a048e7bdc7740874fd95'),
    slug: 'iris-enterprise-explorer',
    name: 'IRIS Enterprise Explorer',
    description: `IRIS Enterprise (IRISe) is a scalable cloud-based solution
        designed to aggregate digital pathology images and derived
        high-dimensional biomarker data collected in cancer immunotherapy
        trials across Roche Pharma. It aims to assist pathologists and
        biomarker scientists within Roche by providing visualized, contextual
        insights into cancer and immune biology, and the mechanism of action of
        new cancer treatments.`,
    picture: 'assets/images/320px-IRIS-Enterprise-Explorer.png',
    website: 'https://iris-stage.navify.com/viewer/e22734db-f807-490c-9747-1bef4768040d/1',  // 'https://iris-stage.navify.com/studies',  // 'https://iris-e-explorer.navify.com',
    apiServerUrl: 'TBA',
    apiHealthCheckUrl: 'plop',
    resourceFormats: [],
    organization: geneId,
    createdBy: adminUserId
}, {
    _id: new mongoose.Types.ObjectId('5cb6a048e7bdc7740874fd96'),
    slug: 'rstudio',
    name: 'RStudio',
    description: `RStudio is a free and open-source integrated development
        environment for R, a programming language for statistical computing
        and graphics.`,
    picture: 'assets/images/320px-RStudio-Logo.png',
    website: 'https://ksuruli-744024.rs.phcaa.science.roche.com/auth-sign-in',
    apiServerUrl: 'TBA',
    apiHealthCheckUrl: 'plop',
    resourceFormats: [],
    organization: geneId,
    createdBy: adminUserId
}, {
    _id: new mongoose.Types.ObjectId('5cb6a048e7bdc7740874fd97'),
    slug: 'jupyter',
    name: 'Jupyter',
    description: `Project Jupyter exists to develop open-source software,
        open-standards, and services for interactive computing across dozens
        of programming languages.`,
    picture: 'assets/images/320px-Jupyter_logo.svg.png',
    website: 'https://ksuruli-6c8242.jh.phcaa.science.roche.com',
    apiServerUrl: 'TBA',
    apiHealthCheckUrl: 'plop',
    resourceFormats: [],
    organization: geneId,
    createdBy: adminUserId
}, {
    _id: new mongoose.Types.ObjectId('5cb6a048e7bdc7740874fd98'),
    slug: 'phcaa',
    name: 'PHC Advanced Analytics',
    description: `PHC Advanced Analytics Platform is a scalable analytics
        platform allowing users (Data Scientists, Clinical/Statistical
        Programmers, Statisticians and Epidemiologists) to establish their own
        baseline analytics environments ("containers"). The containerized,
        cloud-based environments provide a collection of statistical
        programming and data visualization tools to support advanced analytic
        tools (RStudio Pro, RSConnect, Jupyter).`,
    picture: 'assets/images/320px-PHC_IX.png',
    website: 'TBA',
    apiServerUrl: 'TBA',
    apiHealthCheckUrl: 'plop',
    resourceFormats: [],
    organization: geneId,
    createdBy: adminUserId
}];

export {
    tools
};
