import mongoose from 'mongoose';
import {
    sageId
} from './organizations';
import {
    adminUserId
} from './constants';

let users = [{
    _id: adminUserId,
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    username: 'admin',
    email: 'admin@sagebase.org',
    position: 'Research Scientist',
    password: 'admin',
    orcid: 'https://orcid.org/0000-0002-8242-9462',
    organization: sageId,
    createdBy: adminUserId
}];

export {
    users,
    adminUserId
};
