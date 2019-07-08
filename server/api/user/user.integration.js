/* globals describe, expect, it, before, after, beforeEach, afterEach */

import app from '../..';
import User from './user.model';
import Organization from '../organization/organization.model';
import request from 'supertest';
import {
    organizations
} from '../../config/seeds';

describe('User API:', function () {
    var user;

    before(() => {
        return Organization.deleteMany()
            .then(() => User.deleteMany())
            .then(() => Organization.create(organizations))
            .then(() => {
                user = new User({
                    name: 'Fake User',
                    email: 'test@sagebase.org', // must be backed up by an active organization
                    password: 'password',
                    username: 'test'
                });
                return user.save();
            });
    });

    after(() => Promise.all([
        User.deleteMany(),
        Organization.deleteMany()
    ]));

    describe('GET /api/users/me', function () {
        var token;

        before(function (done) {
            request(app)
                .post('/auth/local')
                .send({
                    email: 'test@sagebase.org',
                    password: 'password',
                    username: 'test'
                })
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    token = res.body.token;
                    done();
                });
        });

        it('should respond with a user profile when authenticated', function (done) {
            request(app)
                .get('/api/users/me')
                .set('authorization', `Bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    expect(res.body._id.toString()).to.equal(user._id.toString());
                    done();
                });
        });

        it('should respond with a 401 when not authenticated', function (done) {
            request(app)
                .get('/api/users/me')
                .expect(401)
                .end(done);
        });
    });
});
