import mongoose from 'mongoose';

// const adminUserId = new mongoose.Types.ObjectId();
const adminUserId = '5cb7acea2d718614d81bb97f';

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
