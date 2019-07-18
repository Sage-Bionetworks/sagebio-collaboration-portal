import mongoose from 'mongoose';
import { adminUserId } from './users';

const testProjectId = new mongoose.Types.ObjectId('5cb7acea2d718614d81bb97e');
const anotherProjectId = new mongoose.Types.ObjectId('5cb7acea2d718614d81bb97f');

let projects = [{
    _id: testProjectId,
    name: 'Test Project',
    description: `{\"ops\":[{\"insert\":\"This is a test project.\\n\\n\"}]}`,
    visibility: 'Public',
    createdBy: adminUserId
}, {
    _id: anotherProjectId,
    name: 'Another Project',
    description: `{\"ops\":[{\"insert\":\"This is another project.\\n\\n\"}]}`,
    visibility: 'Public',
    createdBy: adminUserId
}];

export {
    projects
};
