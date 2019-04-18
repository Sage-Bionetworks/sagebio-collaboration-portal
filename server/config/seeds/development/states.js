import mongoose from 'mongoose';

let states = [{
    _id: new mongoose.Types.ObjectId(),
    name: 'Test State 1'
}, {
    _id: new mongoose.Types.ObjectId(),
    name: 'Test State 2'
}];

export {
    states
};
