import mongoose from 'mongoose';
import { adminUserId } from '../default/users';
import { sageId, geneId } from '../default/organizations';

let dataCatalogs = [{
    _id: new mongoose.Types.ObjectId('5cb6a048e7bdc7740874fd91'),
    slug: 'roche-data-portal',
    name: 'Roche Data Portal',  // (Beta)
    description: 'A discoverability portal for the GREX framework',
    apiType: 'CKAN',
    picture: 'assets/images/320px-Roche_Logo.svg.png',
    apiServerUrl: 'https://demo-data.roche.com/api/3',  // 'http://data.roche.com/api/3',
    website: 'https://demo-data.roche.com/',  // 'http://data.roche.com',
    organization: geneId,
    createdBy: adminUserId
}, {
    _id: new mongoose.Types.ObjectId('5cb6a048e7bdc7740874fd92'),
    slug: 'sage',
    name: 'Sage Catalog',
    description: 'A test instance of CKAN',
    apiType: 'CKAN',
    picture: 'assets/images/320px-SageBionetworks_LogoShape.png',
    apiServerUrl: 'https://ckan.phc.sagesandbox.org/api/3',
    website: 'https://ckan.phc.sagesandbox.org',
    organization: sageId,
    createdBy: adminUserId
}, {
    _id: new mongoose.Types.ObjectId('5cb6a048e7bdc7740874f356'),
    slug: 'phc-ix',
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
