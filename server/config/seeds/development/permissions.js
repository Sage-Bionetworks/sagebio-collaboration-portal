import mongoose from 'mongoose';
import {
    adminUserId
} from './users';

const reactivateUserPermId = new mongoose.Types.ObjectId();
const deactivateUserPermId = new mongoose.Types.ObjectId();

let permissions = [{
    _id: reactivateUserPermId,
    name: 'reactivateUser',
    description: 'Reactivate the account of a user',
    createdBy: adminUserId
}, {
    _id: deactivateUserPermId,
    name: 'deactivateUser',
    description: 'Deactivate the account of a user',
    createdBy: adminUserId
}];

export {
    permissions,
    reactivateUserPermId,
    deactivateUserPermId
};
