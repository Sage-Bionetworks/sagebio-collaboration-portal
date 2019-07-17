/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';
import User from '../user/user.model';
import Organization from '../organization/organization.model';
import EntityPermission from './entity-permission.model';
import {
    adminUser,
    anotherUser,
    authOrganization,
    anotherOrganization,
    authenticateUser
} from '../integration-util';

var newEntityPermission;

describe('EntityPermission API:', function () {
    var token;

    before(() => {
        return EntityPermission.deleteMany()
            .then(() => Organization.deleteMany())
            .then(() => User.deleteMany())
            .then(() => User.create([
                adminUser,
                anotherUser
            ]))
            .then(() => Organization.create([
                authOrganization,
                anotherOrganization
            ]))
            .then(authenticateUser(app, adminUser))
            .then(res => token = res);
    });

    after(() => Promise.all([
        EntityPermission.deleteMany(),
        Organization.deleteMany(),
        User.deleteMany()
    ]));

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

    // describe('POST /api/entity-permissions', function () {
    //     beforeEach(function (done) {
    //         request(app)
    //             .post('/api/entity-permissions')
    //             .send({
    //                 name: 'New EntityPermission',
    //                 info: 'This is the brand new entityPermission!!!'
    //             })
    //             .expect(201)
    //             .expect('Content-Type', /json/)
    //             .end((err, res) => {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 newEntityPermission = res.body;
    //                 done();
    //             });
    //     });
    //
    //     it('should respond with the newly created entityPermission', function () {
    //         expect(newEntityPermission.name).to.equal('New EntityPermission');
    //         expect(newEntityPermission.info).to.equal('This is the brand new entityPermission!!!');
    //     });
    // });

    // describe('GET /api/entity-permissions/:id', function () {
    //     var entityPermission;
    //
    //     beforeEach(function (done) {
    //         request(app)
    //             .get(`/api/entity-permissions/${newEntityPermission._id}`)
    //             .expect(200)
    //             .expect('Content-Type', /json/)
    //             .end((err, res) => {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 entityPermission = res.body;
    //                 done();
    //             });
    //     });
    //
    //     afterEach(function () {
    //         entityPermission = {};
    //     });
    //
    //     it('should respond with the requested entityPermission', function () {
    //         expect(entityPermission.name).to.equal('New EntityPermission');
    //         expect(entityPermission.info).to.equal('This is the brand new entityPermission!!!');
    //     });
    // });

    // describe('PUT /api/entity-permissions/:id', function () {
    //     var updatedEntityPermission;
    //
    //     beforeEach(function (done) {
    //         request(app)
    //             .put(`/api/entity-permissions/${newEntityPermission._id}`)
    //             .send({
    //                 name: 'Updated EntityPermission',
    //                 info: 'This is the updated entityPermission!!!'
    //             })
    //             .expect(200)
    //             .expect('Content-Type', /json/)
    //             .end(function (err, res) {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 updatedEntityPermission = res.body;
    //                 done();
    //             });
    //     });
    //
    //     afterEach(function () {
    //         updatedEntityPermission = {};
    //     });
    //
    //     it('should respond with the updated entityPermission', function () {
    //         expect(updatedEntityPermission.name).to.equal('Updated EntityPermission');
    //         expect(updatedEntityPermission.info).to.equal('This is the updated entityPermission!!!');
    //     });
    //
    //     it('should respond with the updated entityPermission on a subsequent GET', function (done) {
    //         request(app)
    //             .get(`/api/entity-permissions/${newEntityPermission._id}`)
    //             .expect(200)
    //             .expect('Content-Type', /json/)
    //             .end((err, res) => {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 let entityPermission = res.body;
    //
    //                 expect(entityPermission.name).to.equal('Updated EntityPermission');
    //                 expect(entityPermission.info).to.equal('This is the updated entityPermission!!!');
    //
    //                 done();
    //             });
    //     });
    // });

    // describe('PATCH /api/entity-permissions/:id', function () {
    //     var patchedEntityPermission;
    //
    //     beforeEach(function (done) {
    //         request(app)
    //             .patch(`/api/entity-permissions/${newEntityPermission._id}`)
    //             .send([{
    //                     op: 'replace',
    //                     path: '/name',
    //                     value: 'Patched EntityPermission'
    //                 },
    //                 {
    //                     op: 'replace',
    //                     path: '/info',
    //                     value: 'This is the patched entityPermission!!!'
    //                 }
    //             ])
    //             .expect(200)
    //             .expect('Content-Type', /json/)
    //             .end(function (err, res) {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 patchedEntityPermission = res.body;
    //                 done();
    //             });
    //     });
    //
    //     afterEach(function () {
    //         patchedEntityPermission = {};
    //     });
    //
    //     it('should respond with the patched entityPermission', function () {
    //         expect(patchedEntityPermission.name).to.equal('Patched EntityPermission');
    //         expect(patchedEntityPermission.info).to.equal('This is the patched entityPermission!!!');
    //     });
    // });

    // describe('DELETE /api/entity-permissions/:id', function () {
    //     it('should respond with 204 on successful removal', function (done) {
    //         request(app)
    //             .delete(`/api/entity-permissions/${newEntityPermission._id}`)
    //             .expect(204)
    //             .end(err => {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 done();
    //             });
    //     });
    //
    //     it('should respond with 404 when entityPermission does not exist', function (done) {
    //         request(app)
    //             .delete(`/api/entity-permissions/${newEntityPermission._id}`)
    //             .expect(404)
    //             .end(err => {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 done();
    //             });
    //     });
    // });
});
