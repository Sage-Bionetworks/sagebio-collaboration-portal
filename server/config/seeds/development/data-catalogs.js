import mongoose from 'mongoose';
import { adminUserId } from '../default/users';
import { sageId, geneId } from '../default/organizations';
import { dataCatalogApiTypes } from '../../environment';

const sageCkanCatalog = {
    _id: new mongoose.Types.ObjectId('5cb6a048e7bdc7740874fd92'),
    title: 'Sage Catalog',
    description: 'A test instance of CKAN',
    apiType: dataCatalogApiTypes.CKAN.value,
    picture: 'assets/images/320px-SageBionetworks_LogoShape.png',
    apiServerUrl: 'https://ckan.phc.sagesandbox.org/api/3',
    apiHealthCheckUrl: 'https://ckan.phc.sagesandbox.org/api/3',
    website: 'https://ckan.phc.sagesandbox.org',
    organization: sageId,
    createdBy: adminUserId,
};

let dataCatalogs = [
    sageCkanCatalog,
    // {
    //     _id: new mongoose.Types.ObjectId('5cb6a049e7bdc7740874fd92'),
    //     title: 'Catalog Test',
    //     description: 'A test instance of CKAN',
    //     apiType: dataCatalogApiTypes.CKAN.value,
    //     apiServerUrl: 'https://ckan.phc.sagesandbox.org/api/3',
    //     apiHealthCheckUrl: 'https://ckan.phc.sagesandbox.org/api/3',
    //     website: 'https://ckan.phc.sagesandbox.org',
    //     organization: sageId,
    //     createdBy: adminUserId,
    // },
    {
        _id: new mongoose.Types.ObjectId('5cb6a048e7bdc7740874fd91'),
        title: 'Roche Data Portal',
        description: 'A discoverability portal for the GREX framework',
        apiType: dataCatalogApiTypes.CKAN.value,
        picture: 'assets/images/320px-Roche_Logo.svg.png',
        apiServerUrl: 'https://demo-data.roche.com/api/3',
        apiHealthCheckUrl: 'https://demo-data.roche.com/api/3',
        website: 'https://demo-data.roche.com/',
        organization: geneId,
        createdBy: adminUserId,
    },
    {
        _id: new mongoose.Types.ObjectId('5cb6a048e7bdc7740874f356'),
        title: 'SageBio-IX Data Catalog',
        description: 'A SageBio-IX Advanced Analytics data source',
        apiType: dataCatalogApiTypes.CKAN.value,
        picture: 'assets/images/320px-Roche_Logo.svg.png',
        apiServerUrl: 'http://phc-ckan.aws.science.roche.com/api/3',
        apiHealthCheckUrl: 'http://phc-ckan.aws.science.roche.com/api/3',
        website: 'http://phc-ckan.aws.science.roche.com',
        organization: geneId,
        createdBy: adminUserId,
    },
];

export { dataCatalogs, sageCkanCatalog };
