import mongoose from 'mongoose';

const sageId = '5cb6a048e7bdc7740874fd87';
const geneId = '5cb6a048e7bdc7740874fd88';

let organizations = [{
    _id: sageId,
    name: 'Sage Bionetworks',
    website: 'http://sagebionetworks.org',
    picture: 'http://dev.phc.sagesandbox.org/assets/images/320px-SageBionetworks_LogoShape.png'
}, {
    _id: geneId,
    name: 'Roche/Genentech',
    website: 'https://www.gene.com',
    picture: 'http://dev.phc.sagesandbox.org/assets/images/320px-Roche_Logo.svg.png'
}];

export {
    organizations,
    sageId,
    geneId
};
