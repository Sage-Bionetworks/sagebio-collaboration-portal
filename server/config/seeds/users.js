import mongoose from 'mongoose';

const testUserId = new mongoose.Types.ObjectId();
const adminUserId = new mongoose.Types.ObjectId();
const thomasUserId = new mongoose.Types.ObjectId();
const jamesUserId = new mongoose.Types.ObjectId();
const kimUserId = new mongoose.Types.ObjectId();

let users = [{
    _id: testUserId,
    provider: 'local',
    name: 'Test User',
    email: 'test@example.com',
    password: 'test',
    createdBy: adminUserId
}, {
    _id: adminUserId,
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@example.com',
    password: 'admin',
    createdBy: adminUserId
}, {
    _id: thomasUserId,
    provider: 'local',
    role: 'admin',
    name: 'Thomas',
    email: 'thomas@test.com',
    password: 'test',
    createdBy: adminUserId
}, {
    _id: jamesUserId,
    provider: 'local',
    role: 'admin',
    name: 'James',
    email: 'james@test.com',
    password: 'test',
    createdBy: thomasUserId
}, {
    _id: kimUserId,
    provider: 'local',
    role: 'admin',
    name: 'Kim',
    email: 'kim@test.com',
    password: 'test',
    createdBy: thomasUserId
}];

export {
    users,
    testUserId,
    adminUserId,
    thomasUserId,
    jamesUserId,
    kimUserId,
};
