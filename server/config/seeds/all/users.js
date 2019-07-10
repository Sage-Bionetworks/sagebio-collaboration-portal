import mongoose from 'mongoose';
import {
    adminUserId
} from './constants';
import config from '../../environment';

let users = [{
    _id: adminUserId,
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    username: 'admin',
    email: config.init.admin.email,
    password: config.init.admin.password,
    position: 'Research Scientist',
    orcid: 'https://orcid.org/0000-0002-8242-9462',
    createdBy: adminUserId
}, {
    _id: new mongoose.Types.ObjectId('1237acea2d718614d81bbabc'),
    provider: 'local',
    role: 'user',
    name: 'Carlos Test',
    username: 'carlos',
    email: 'carlos@genui.co',
    password: 'test',
    position: 'Research Scientist',
    orcid: 'https://orcid.org/0000-0002-8242-9462',
    createdBy: new mongoose.Types.ObjectId('1237acea2d718614d81bbabc')
}];

export {
    users,
    adminUserId
};
