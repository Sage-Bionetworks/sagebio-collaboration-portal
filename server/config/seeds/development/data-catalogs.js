import mongoose from 'mongoose';
import { adminUserId } from './users';
import { sageId, geneId } from './organizations';

let dataCatalogs = [{
    _id: new mongoose.Types.ObjectId(),
    name: 'Roche Data Portal',  // (Beta)
    description: 'A discoverability portal for the GREX framework',
    apiType: 'CKAN',
    image: 'assets/images/320px-Roche_Logo.svg.png',
    apiServerUrl: 'http://data.roche.com/api/3',
    website: 'http://data.roche.com',
    // active: true,
    organization: geneId,
    createdBy: adminUserId
}, {
    _id: new mongoose.Types.ObjectId(),
    name: 'Sage Catalog',
    description: 'A test instance of CKAN',
    apiType: 'CKAN',
    image: 'assets/images/320px-SageBionetworks_LogoShape.png',
    apiServerUrl: 'http://54.166.200.47/api/3',
    website: 'http://54.166.200.47',
    // active: true,
    organization: sageId,
    createdBy: adminUserId
}];

export {
    dataCatalogs
};
