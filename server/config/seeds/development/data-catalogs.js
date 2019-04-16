import mongoose from 'mongoose';
import { adminUserId } from './users';

let dataCatalogs = [{
    _id: new mongoose.Types.ObjectId(),
    name: 'Roche Data Portal',  // (Beta)
    description: 'A discoverability portal for the GREX framework',
    apiType: 'CKAN',
    image: 'assets/images/320px-Roche_Logo.svg.png',
    apiServerUrl: 'http://data.roche.com/api/3',
    website: 'http://data.roche.com',
    // active: true,
    organizationName: 'Roche/Genentech',
    organizationUrl: 'https://www.roche.com',
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
    organizationName: 'Sage Bionetworks',
    organizationUrl: 'http://sagebionetworks.org',
    createdBy: adminUserId
}];

export {
    dataCatalogs
};
