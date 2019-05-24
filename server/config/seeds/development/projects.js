import mongoose from 'mongoose';
import { adminUserId } from './users';

// const testProjectId = new mongoose.Types.ObjectId('5cb7acea2d718614d81bb97e');
// const anotherProjectId = new mongoose.Types.ObjectId('5cb7acea2d718614d81bb97f');

let projects = [{
    // _id: testUserId,
    name: 'Test Project',
    description: 'This is a test project',
    createdBy: adminUserId
}, {
    // _id: adminUserId,
    name: 'Another Project',
    description: 'This is another project',
    createdBy: adminUserId
}];

export {
    projects
};
