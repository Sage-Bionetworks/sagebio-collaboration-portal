import mongoose from 'mongoose';
import request from 'supertest';
import {
    pick
} from 'lodash/fp';
import User from './user/user.model';
import Organization from './organization/organization.model';
// import config from '../config/environment';

const adminUserId = new mongoose.Types.ObjectId('5cb7acea2d718614d81bb97f');
const anotherUserId = new mongoose.Types.ObjectId('5cb7a5ea2d718614d81bb4d2');

const authOrganizationId = new mongoose.Types.ObjectId('5cb7acea2d718615d81bb97f');
const anotherOrganizationId = new mongoose.Types.ObjectId('5cb7ace62d718615d81bb8e1');

const adminUser = {
    _id: adminUserId,
    name: 'admin',
    username: 'admin',
    email: 'admin@sagebase.org',
    password: 'admin',
    role: 'admin'
};

const anotherUser = {
    _id: anotherUserId,
    name: 'Another User',
    username: 'anotheruser',
    email: 'anotheruser@sagebase.org',
    password: 'anotheruser',
    role: 'user'
};

const authOrganization = {
    _id: authOrganizationId,
    name: 'Auth Organization',
    website: 'https://sagebionetworks.org',
    domains: [
        'sagebase.org'
    ],
    active: true,
    createdBy: adminUserId
};

const anotherOrganization = {
    _id: anotherOrganizationId,
    name: 'Another Organization',
    website: 'https://google.com',
    domains: [
        'google.com'
    ],
    active: true,
    createdBy: adminUserId
};

export function authenticateUser(app, user) {
    return function () {
        return request(app)
            .post('/auth/local')
            .send(pick([
                'email',
                'password'
            ], user))
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => res.body.token);
    }
}

export {
    adminUser,
    anotherUser,

    authOrganization,
    anotherOrganization
};
