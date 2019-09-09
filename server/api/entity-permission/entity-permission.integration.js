/* globals describe, expect, it, before, beforeEach, after, afterEach */

var app = require('../..');
import request from 'supertest';
import User from '../user/user.model';
import Organization from '../organization/organization.model';
import EntityPermission from './entity-permission.model';
import { adminUser, anotherUser, authOrganization, anotherOrganization, authenticateUser } from '../integration-util';
import { entityTypes, accessTypes, inviteStatusTypes } from '../../config/environment';

var newEntityPermission;
var newEntityPermission2;

describe('EntityPermission API:', function () {
    var token;

    before(() =>
        EntityPermission.deleteMany()
            .then(() => Organization.deleteMany())
            .then(() => User.deleteMany())
            .then(() => User.create([adminUser, anotherUser]))
            .then(() => Organization.create([authOrganization, anotherOrganization]))
            .then(authenticateUser(app, adminUser))
            .then(res => {
                token = res;
            })
    );

    after(() => Promise.all([EntityPermission.deleteMany(), Organization.deleteMany(), User.deleteMany()]));

    describe('GET /api/entity-permissions', function () {
        var entityPermissions;

        beforeEach(function (done) {
            request(app)
                .get('/api/entity-permissions')
                .set('authorization', `Bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    entityPermissions = res.body;
                    done();
                });
        });

        it('should respond with JSON array', function () {
            expect(entityPermissions).to.be.instanceOf(Array);
        });
    });

    describe('GET /api/entity-permissions/entity/:entity', function () {
        var entityPermissions;

        beforeEach(function (done) {
            request(app)
                .get('/api/entity-permissions/entity/4e657720656e746974794969')
                .set('authorization', `Bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    entityPermissions = res.body;
                    done();
                });
        });

        it('should respond with JSON array', function () {
            expect(entityPermissions).to.be.instanceOf(Array);
        });
    });

    describe('POST /api/entity-permissions', function () {
        beforeEach(function (done) {
            request(app)
                .post('/api/entity-permissions')
                .set('authorization', `Bearer ${token}`)
                .send({
                    entityId: '4e657720656e746974794965',
                    entityType: entityTypes.PROJECT.value,
                    user: anotherUser._id.toString(),
                    access: accessTypes.ADMIN.value,
                    status: inviteStatusTypes.ACCEPTED.value,
                })
                .expect(201)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    newEntityPermission = res.body;
                    done();
                });
        });

        it('should respond with the newly created entityPermission', function () {
            expect(newEntityPermission.entityId).to.equal('4e657720656e746974794965');
            expect(newEntityPermission.entityType).to.equal(entityTypes.PROJECT.value);
            expect(newEntityPermission.user._id).to.equal(anotherUser._id.toString());
            expect(newEntityPermission.access).to.equal(accessTypes.ADMIN.value);
            expect(newEntityPermission.status).to.equal(inviteStatusTypes.ACCEPTED.value);
            expect(newEntityPermission.createdBy._id).to.equal(adminUser._id.toString());
        });
    });

    describe('PATCH /api/entity-permissions/:id', function () {
        it('should respond with 403 on attempt to downgrade the access of the last Admin of an entity', function (done) {
            request(app)
                .patch(`/api/entity-permissions/${newEntityPermission._id}`)
                .set('authorization', `Bearer ${token}`)
                .send([
                    {
                        op: 'replace',
                        path: '/access',
                        value: accessTypes.WRITE.value,
                    },
                ])
                .expect(403)
                .end(err => {
                    if (err) {
                        return done(err);
                    }
                    done();
                });
        });
    });

    describe('DELETE /api/entity-permissions/:id', function () {
        it('should respond with 403 on attempt to remove the last admin of an entity', function (done) {
            request(app)
                .delete(`/api/entity-permissions/${newEntityPermission._id}`)
                .set('authorization', `Bearer ${token}`)
                .expect(403)
                .end(err => {
                    if (err) {
                        return done(err);
                    }
                    done();
                });
        });
    });

    describe('POST /api/entity-permissions (add a second admin to the same entity)', function () {
        beforeEach(function (done) {
            request(app)
                .post('/api/entity-permissions')
                .set('authorization', `Bearer ${token}`)
                .send({
                    entityId: '4e657720656e746974794965',
                    entityType: entityTypes.PROJECT.value,
                    user: adminUser._id.toString(),
                    access: accessTypes.ADMIN.value,
                    status: inviteStatusTypes.ACCEPTED.value,
                })
                .expect(201)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    newEntityPermission2 = res.body;
                    done();
                });
        });

        it('should respond with the newly created entityPermission', function () {
            expect(newEntityPermission2.entityId).to.equal('4e657720656e746974794965');
            expect(newEntityPermission2.entityType).to.equal(entityTypes.PROJECT.value);
            expect(newEntityPermission2.user._id).to.equal(adminUser._id.toString());
            expect(newEntityPermission2.access).to.equal(accessTypes.ADMIN.value);
            expect(newEntityPermission2.status).to.equal(inviteStatusTypes.ACCEPTED.value);
            expect(newEntityPermission2.createdBy._id).to.equal(adminUser._id.toString());
        });
    });

    describe('PATCH /api/entity-permissions/:id (downgrade of the first admin)', function () {
        var patchedEntityPermission;

        beforeEach(function (done) {
            request(app)
                .patch(`/api/entity-permissions/${newEntityPermission._id}`)
                .set('authorization', `Bearer ${token}`)
                .send([
                    {
                        op: 'replace',
                        path: '/access',
                        value: accessTypes.WRITE.value,
                    },
                ])
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    patchedEntityPermission = res.body;
                    done();
                });
        });

        afterEach(function () {
            patchedEntityPermission = {};
        });

        it('should respond with the patched entityPermission', function () {
            expect(patchedEntityPermission.entityId).to.equal('4e657720656e746974794965');
            expect(patchedEntityPermission.entityType).to.equal(entityTypes.PROJECT.value);
            expect(patchedEntityPermission.user._id).to.equal(anotherUser._id.toString());
            expect(patchedEntityPermission.access).to.equal(accessTypes.WRITE.value);
            expect(patchedEntityPermission.status).to.equal(inviteStatusTypes.ACCEPTED.value);
            expect(patchedEntityPermission.createdBy._id).to.equal(adminUser._id.toString());
        });
    });

    describe('DELETE /api/entity-permissions/:id (removal of the first admin)', function () {
        it('should respond with 204 on successful removal', function (done) {
            request(app)
                .delete(`/api/entity-permissions/${newEntityPermission._id}`)
                .set('authorization', `Bearer ${token}`)
                .expect(204)
                .end(err => {
                    if (err) {
                        return done(err);
                    }
                    done();
                });
        });

        it('should respond with 404 when entityPermission does not exist', function (done) {
            request(app)
                .delete(`/api/entity-permissions/${newEntityPermission._id}`)
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
