import mongoose from 'mongoose';

let dataCatalogs = [{
    _id: new mongoose.Types.ObjectId(),
    name: 'Roche Data Portal (Beta)',
    description: 'A discoverability portal for the GREX framework'
}, {
    _id: new mongoose.Types.ObjectId(),
    name: 'Sage Data Portal',
    description: 'A test instance of CKAN'
}];

export {
    dataCatalogs
};
