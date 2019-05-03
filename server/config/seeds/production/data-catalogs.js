import mongoose from 'mongoose';
import { adminUserId } from './users';
import { sageId, geneId } from './organizations';

let dataCatalogs = [{
    _id: new mongoose.Types.ObjectId('5cb6a048e7bdc7740874fd91'),
    name: 'Roche Data Portal',  // (Beta)
    description: 'A discoverability portal for the GREX framework',
    apiType: 'CKAN',
    picture: 'assets/images/320px-Roche_Logo.svg.png',
    apiServerUrl: 'http://data.roche.com/api/3',
    website: 'http://data.roche.com',
    organization: geneId,
    createdBy: adminUserId
}, {
    _id: new mongoose.Types.ObjectId('5cb6a048e7bdc7740874fd92'),
    name: 'Sage Catalog',
    description: 'A test instance of CKAN',
    apiType: 'CKAN',
    picture: 'assets/images/320px-SageBionetworks_LogoShape.png',
    apiServerUrl: 'http://phc-ckan.sagesandbox.org/api/3',
    website: 'http://phc-ckan.sagesandbox.org',
    organization: sageId,
    createdBy: adminUserId
}, {
    _id: new mongoose.Types.ObjectId('5cb6a048e7bdc7740874f356'),
    name: 'PHC-IX Data Catalog',
    description: 'A PHC-IX Advanced Analytics data source',
    apiType: 'CKAN',
    picture: 'assets/images/320px-Roche_Logo.svg.png',
    apiServerUrl: 'http://phc-ckan.aws.science.roche.com/api/3',
    website: 'http://phc-ckan.aws.science.roche.com',
    organization: geneId,
    createdBy: adminUserId
}];

export {
    dataCatalogs
};
