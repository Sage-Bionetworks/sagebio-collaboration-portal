/* globals describe, expect, it, before, after, beforeEach, afterEach */

import app from '../..';
import User from './user.model';
import Organization from '../organization/organization.model';
import request from 'supertest';
import { pick } from 'lodash/fp';
import { adminUser, authOrganization } from '../integration-util';

describe('User API:', function () {
    before(() =>
        User.deleteMany()
            .then(() => Organization.deleteMany())
            .then(() => new User(adminUser).save())
            .then(() => new Organization(authOrganization).save())
    );

    after(() => Promise.all([Organization.deleteMany(), User.deleteMany()]));

    describe('GET /api/users/me', function () {
        var token;

        before(function (done) {
            request(app)
                .post('/auth/local')
                .send(pick(['email', 'password'], adminUser))
                .expect(200)
                .expect('Content-Type', /json/)
                .end((_, res) => {
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
                .end((_, res) => {
                    expect(res.body._id.toString()).to.equal(adminUser._id.toString());
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
