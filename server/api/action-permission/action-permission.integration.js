/* globals describe, expect, it, before, beforeEach, after, afterEach */

var app = require('../..');
import request from 'supertest';
import User from '../user/user.model';
import Organization from '../organization/organization.model';
import ActionPermission from './action-permission.model';
import { adminUser, anotherUser, authOrganization, anotherOrganization, authenticateUser } from '../integration-util';
import { actionPermissionTypes } from '../../config/environment';

var newActionPermission;

describe('ActionPermission API:', function () {
    var token;

    before(() =>
        ActionPermission.deleteMany()
            .then(() => Organization.deleteMany())
            .then(() => User.deleteMany())
            .then(() => User.create([adminUser, anotherUser]))
            .then(() => Organization.create([authOrganization, anotherOrganization]))
            .then(authenticateUser(app, adminUser))
            .then(res => {
                token = res;
            })
    );

    after(() => Promise.all([ActionPermission.deleteMany(), Organization.deleteMany(), User.deleteMany()]));

    describe('GET /api/action-permissions', function () {
        var response;

        beforeEach(function (done) {
            request(app)
                .get('/api/action-permissions')
                .set('authorization', `Bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    response = res.body;
                    done();
                });
        });

        it('should respond with JSON array', function () {
            expect(response).to.be.instanceOf(Array);
        });
    });

    describe('GET /api/action-permissions/users/:userId', function () {
        var response;

        beforeEach(function (done) {
            request(app)
                .get(`/api/action-permissions/users/${anotherUser._id}`)
                .set('authorization', `Bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    response = res.body;
                    done();
                });
        });

        it('should respond with JSON array', function () {
            expect(response).to.be.instanceOf(Array);
        });
    });

    describe('POST /api/action-permissions', function () {
        beforeEach(function (done) {
            request(app)
                .post('/api/action-permissions')
                .set('authorization', `Bearer ${token}`)
                .send({
                    user: anotherUser._id,
                    action: actionPermissionTypes.CREATE_PROJECT.value,
                })
                .expect(201)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    newActionPermission = res.body;
                    done();
                });
        });

        it('should respond with the newly created actionPermission', function () {
            expect(newActionPermission.user).to.equal(anotherUser._id.toString());
            expect(newActionPermission.action).to.equal(actionPermissionTypes.CREATE_PROJECT.value);
            expect(newActionPermission.createdBy).to.equal(adminUser._id.toString());
        });
    });

    describe('DELETE /api/action-permissions/:id', function () {
        it('should respond with 204 on successful removal', function (done) {
            request(app)
                .delete(`/api/action-permissions/${newActionPermission._id}`)
                .set('authorization', `Bearer ${token}`)
                .expect(204)
                .end(err => {
                    if (err) {
                        return done(err);
                    }
                    done();
                });
        });

        it('should respond with 404 when actionPermission does not exist', function (done) {
            request(app)
                .delete(`/api/action-permissions/${newActionPermission._id}`)
                .set('authorization', `Bearer ${token}`)
                .expect(404)
                .end(err => {
                    if (err) {
                        return done(err);
                    }
                    done();
                });
        });
    });
});
