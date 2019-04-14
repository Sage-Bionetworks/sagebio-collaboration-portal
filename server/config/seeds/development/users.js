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
    username: 'test',
    email: 'test@example.com',
    password: 'test',
    createdBy: adminUserId
}, {
    _id: adminUserId,
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin',
    createdBy: adminUserId
}];

export {
    users,
    testUserId,
    adminUserId
};
