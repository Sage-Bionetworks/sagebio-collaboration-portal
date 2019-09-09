import mongoose from 'mongoose';
import { adminUserId } from './constants';

const sageId = new mongoose.Types.ObjectId('5cb6a048e7bdc7740874fd87');
const geneId = new mongoose.Types.ObjectId('5cb6a048e7bdc7740874fd88');

let organizations = [
    {
        _id: sageId,
        title: 'Sage Bionetworks',
        description: 'A description',
        website: 'http://sagebionetworks.org',
        domains: ['sagebase.org', 'sagebionetworks.org'],
        active: true,
        createdBy: adminUserId,
    },
    {
        _id: geneId,
        title: 'Roche/Genentech',
        description: 'A description',
        website: 'https://www.gene.com',
        domains: ['gene.com', 'roche.com'],
        active: true,
        createdBy: adminUserId,
    },
];

export { organizations, sageId, geneId };
