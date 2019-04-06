import mongoose from 'mongoose';

let datasets = [{
    _id: new mongoose.Types.ObjectId(),
    name: 'My Dataset',
}, {
    _id: new mongoose.Types.ObjectId(),
    name: 'Dataset Test',
}, {
    _id: new mongoose.Types.ObjectId(),
    name: 'Dataset 3',
}];

export {
    datasets
};
