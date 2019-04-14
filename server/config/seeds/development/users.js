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
    orcid: 'https://orcid.org/0000-0002-8242-9462',
    createdBy: adminUserId
}, {
    _id: adminUserId,
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    username: 'admin',
    email: 'admin@example.com',
    position: 'Research Scientist',
    password: 'admin',
    orcid: 'https://orcid.org/0000-0002-8242-9462',
    createdBy: adminUserId
}];

export {
    users,
    testUserId,
    adminUserId
};
