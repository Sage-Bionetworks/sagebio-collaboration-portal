import mongoose from 'mongoose';

const adminUserId = new mongoose.Types.ObjectId();

let users = [{
    _id: adminUserId,
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    username: 'admin',
    email: 'admin@sagebase.org',
    password: 'admin'
}];

export {
    users
};
