import mongoose from 'mongoose';

const adminUserId = new mongoose.Types.ObjectId();

let users = [{
    _id: adminUserId,
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@example.com',
    password: 'admin'
}];

export {
    users
};
