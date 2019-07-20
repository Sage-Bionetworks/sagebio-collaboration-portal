import mongoose from 'mongoose';
import {
    users,
    adminUserId
} from '../all/users';

const testUserId = new mongoose.Types.ObjectId('5cb7acea2d718614d81cc97e');

users.push(...[{
    _id: testUserId,
    provider: 'local',
    name: 'Test User',
    username: 'test',
    email: 'test@sagebase.org',
    password: 'test',
    orcid: 'https://orcid.org/0000-0002-8242-9462',
    createdBy: adminUserId
}]);

export {
    users,
    testUserId,
    adminUserId
};
