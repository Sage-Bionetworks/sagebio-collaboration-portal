import mongoose from 'mongoose';

const testUserId = new mongoose.Types.ObjectId('5cb7acea2d718614d81bb97e');
const adminUserId = new mongoose.Types.ObjectId('5cb7acea2d718614d81bb97f');

let users = [{
    _id: testUserId,
    provider: 'local',
    name: 'Test User',
    username: 'test',
    email: 'test@sagebase.org',
    password: 'test',
    orcid: 'https://orcid.org/0000-0002-8242-9462',
    createdBy: adminUserId
}, {
    _id: adminUserId,
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    username: 'admin',
    email: 'admin@sagebase.org',
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
