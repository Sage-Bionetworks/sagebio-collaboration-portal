import mongoose from 'mongoose';

const sageId = new mongoose.Types.ObjectId();
const geneId = new mongoose.Types.ObjectId();

let organizations = [{
    _id: sageId,
    name: 'Sage Bionetworks',
    website: 'http://sagebionetworks.org',
    picture: 'assets/images/320px-SageBionetworks_LogoShape.png'
}, {
    _id: geneId,
    name: 'Roche/Genentech',
    website: 'https://www.gene.com',
    picture: 'assets/images/320px-Roche_Logo.svg.png'
}];

export {
    organizations,
    sageId,
    geneId
};
