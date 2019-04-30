import mongoose from 'mongoose';
import { adminUserId } from './users';

const sageId = new mongoose.Types.ObjectId('5cb6a048e7bdc7740874fd87');
const geneId = new mongoose.Types.ObjectId('5cb6a048e7bdc7740874fd88');

let organizations = [{
    _id: sageId,
    name: 'Sage Bionetworks',
    website: 'http://sagebionetworks.org',
    picture: 'assets/images/320px-SageBionetworks_LogoShape.png',
    createdBy: adminUserId
}, {
    _id: geneId,
    name: 'Roche/Genentech',
    website: 'https://www.gene.com',
    picture: 'assets/images/320px-Roche_Logo.svg.png',
    createdBy: adminUserId
}];

export {
    organizations,
    sageId,
    geneId
};
