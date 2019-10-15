import mongoose from 'mongoose';
import {
    users,
    adminUserId
} from '../default/users';

// Notes:
// - Users must have the property _id.

const testUserId = new mongoose.Types.ObjectId('5cb7acea2d718614d81cc97e');
const testUser1Id = new mongoose.Types.ObjectId('5cb7acea2371abc4d8121e91');

users.push(...[{
    _id: testUserId,
    provider: 'local',
    name: 'Test User',
    username: 'test',
    email: 'test@sagebase.org',
    password: 'test',
    orcid: 'https://orcid.org/0000-0002-8242-9462',
    createdBy: adminUserId
},
{
    _id: testUser1Id,
    provider: 'local',
    name: 'Test User1',
    username: 'test1',
    email: 'test1@sagebase.org',
    password: 'test',
    orcid: 'https://orcid.org/0000-0002-8242-9462',
    createdBy: adminUserId
}]);

export {
    users,
    testUserId,
    testUser1Id,
    adminUserId
};
