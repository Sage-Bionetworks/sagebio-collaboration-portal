import mongoose from 'mongoose';
import { sageId, geneId } from '../default/organizations';
import { adminUserId } from '../default/users';
import config from '../../environment';

const phccpShinyToolExample = {
    _id: new mongoose.Types.ObjectId('5cb7acb3167e4f14b29dfb1b'),
    title: 'SBCP Shiny Tool Example',
    description: `A Shiny App for demonstrating features of this collaboration ` +
        `portal.`,
    picture: 'assets/images/320px-shinyLogo.png',
    website: 'https://phccp-shiny.synapse.org/develop/app',
    // apiServerUrl: 'TBA',
    apiHealthCheckUrl: 'https://phccp-shiny.synapse.org/develop/app',
    resourceFormats: ['CSV', 'JSON', 'plain text', 'TXT'],
    organization: sageId,
    createdBy: adminUserId
};

let tools = [
    phccpShinyToolExample,
    {
        _id: new mongoose.Types.ObjectId('5cb6a048e7bdc7740874fd93'),
        title: 'Facile Explorer',
        description: `A Shiny App for self-service and exploratory analytics. ` +
            `It empowers users to compute over data and is designed to enable ` +
            `sustained independent data exploration. The FacileData ecosystem was ` +
            `designed to support exploration of clinical trial data and facilitate ` +
            `communication between bench and computational scientists to accelerate ` +
            `discovery.`,
        picture: 'assets/images/320px-shinyLogo.png',
        website: 'http://gred-shiny-p01.sc1.roche.com:3838/facileexplorer',  // 'http://gred-shiny-p01.sc1.roche.com:3838/facileexplorer',
        // apiServerUrl: 'TBA',
        apiHealthCheckUrl: 'http://gred-shiny-p01.sc1.roche.com:3838/facileexplorer',
        resourceFormats: [],
        organization: geneId,
        createdBy: adminUserId
    },
    {
        _id: new mongoose.Types.ObjectId('5cb6a048e7bdc7740874fd95'),
        title: 'IRIS Enterprise Explorer',
        description: `IRIS Enterprise (IRISe) is a scalable cloud-based solution ` +
            `designed to aggregate digital pathology images and derived ` +
            `high-dimensional biomarker data collected in cancer immunotherapy ` +
            `trials across Roche Pharma. It aims to assist pathologists and ` +
            `biomarker scientists within Roche by providing visualized, contextual ` +
            `insights into cancer and immune biology, and the mechanism of action of ` +
            `new cancer treatments.`,
        picture: 'assets/images/320px-IRIS-Enterprise-Explorer.png',
        website: 'https://iris-e-explorer.navify.com/redirect/0oa2ysnuc9hso3LIb0i7/studies',  // 'https://iris-stage.navify.com/studies',  // 'https://iris-e-explorer.navify.com',
        // apiServerUrl: 'TBA',
        apiHealthCheckUrl: 'https://iris-e-explorer.navify.com/redirect/0oa2ysnuc9hso3LIb0i7/studies',
        resourceFormats: [],
        organization: geneId,
        createdBy: adminUserId
    },
    {
        _id: new mongoose.Types.ObjectId('5cb6a048e7bdc7740874fd98'),
        title: 'PHC Advanced Analytics',
        description: `PHC Advanced Analytics Platform is a scalable analytics ` +
            `platform allowing users (Data Scientists, Clinical/Statistical ` +
            `Programmers, Statisticians and Epidemiologists) to establish their own ` +
            `baseline analytics environments ("containers"). The containerized, ` +
            `cloud-based environments provide a collection of statistical ` +
            `programming and data visualization tools to support advanced analytic ` +
            `tools (RStudio Pro, RSConnect, Jupyter).`,
        picture: 'assets/images/320px-PHC_IX.png',
        website: 'https://myapps.microsoft.com/signin/RStudio%20%20Jupyter/8eecef32-7c32-417f-b2a4-7b1ba4ee83e9?tenantId=c8036283-1408-4dc8-b870-31e789a0a528',
        // apiServerUrl: 'TBA',
        apiHealthCheckUrl: 'https://myapps.microsoft.com/signin/RStudio%20%20Jupyter/8eecef32-7c32-417f-b2a4-7b1ba4ee83e9?tenantId=c8036283-1408-4dc8-b870-31e789a0a528',
        resourceFormats: [],
        organization: geneId,
        createdBy: adminUserId
    },
    {
        _id: new mongoose.Types.ObjectId('5cb7acb3167e4f24b29dfb1b'),
        title: 'Test tool',
        description: 'A desctipion',
        website: 'https://phccp-shiny.synapse.org/develop/app',
        apiHealthCheckUrl: 'https://phccp-shiny.synapse.org/develop/app',
        resourceFormats: ['CSV', 'JSON', 'plain text', 'TXT'],
        organization: sageId,
        createdBy: adminUserId
    }
];

export {
    tools,
    phccpShinyToolExample
};
