import mongoose from 'mongoose';

let states = [{
    _id: new mongoose.Types.ObjectId('5cb8de033f40db38a280a99e'),
    name: 'Test State 1',
    description: 'a description',
    data: 'some data'
}, {
    _id: new mongoose.Types.ObjectId('5cb8de033f40db38a280a99f'),
    name: 'Test State 2',
    description: 'a description',
    data: 'some data'
}];

export {
    states
};
