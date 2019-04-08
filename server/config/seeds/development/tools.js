import mongoose from 'mongoose';

let tools = [{
    _id: new mongoose.Types.ObjectId(),
    name: 'Facile Explorer',
    description: ''
}, {
    _id: new mongoose.Types.ObjectId(),
    name: 'FE-lite',
    description: ''
}, {
    _id: new mongoose.Types.ObjectId(),
    name: 'IRIS Image Explorer',
    description: ''
}, {
    _id: new mongoose.Types.ObjectId(),
    name: 'RStudio',
    description: ''
}, {
    _id: new mongoose.Types.ObjectId(),
    name: 'Jupyter',
    description: ''
}, {
    _id: new mongoose.Types.ObjectId(),
    name: 'PHC Advanced Analytics',
    description: ''
}];

export {
    tools
};
