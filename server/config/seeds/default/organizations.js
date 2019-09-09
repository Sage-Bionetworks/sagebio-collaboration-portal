import mongoose from 'mongoose';
import { adminUserId } from './constants';

const sageId = new mongoose.Types.ObjectId('5cb6a048e7bdc7740874fd87');
const geneId = new mongoose.Types.ObjectId('5cb6a048e7bdc7740874fd88');

let organizations = [ // TODO Make inherit entity
    {
        _id: sageId,
        name: 'Sage Bionetworks',
        website: 'http://sagebionetworks.org',
        domains: ['sagebase.org', 'sagebionetworks.org'],
        picture: 'assets/images/320px-SageBionetworks_LogoShape.png',
        active: true,
        createdBy: adminUserId,
    },
    {
        _id: geneId,
        name: 'Roche/Genentech',
        website: 'https://www.gene.com',
        domains: ['gene.com', 'roche.com'],
        picture: 'assets/images/320px-Roche_Logo.svg.png',
        active: true,
        createdBy: adminUserId,
    },
];

export { organizations, sageId, geneId };
