/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';
import User from '../user/user.model';
import { permissionTypes } from './user-permission.model';

var newUserPermission;

describe('UserPermission API:', function () {
    var user;
    var anotherUser;

    // Clear users before testing
    before(() =>
        User.deleteMany()
        .then(() => {
            user = new User({
                name: 'Fake User',
                email: 'test@example.com',
                password: 'password',
                username: 'test'
            });

            anotherUser = new User({
                name: 'Another User',
                email: 'another@example.com',
                password: 'password',
                username: 'another'
            });

            return Promise.all([
                user.save(),
                anotherUser.save()
            ]);
        })
    );

    // Clear users after testing
    after(() => User.deleteMany());

    describe('GET /api/user-permissions', function () {
        var userPermissions;

        beforeEach(function (done) {
            request(app)
                .get('/api/user-permissions')
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    userPermissions = res.body;
                    done();
                });
        });

        it('should respond with JSON array', function () {
            expect(userPermissions).to.be.instanceOf(Array);
        });
    });

    // describe('POST /api/user-permissions', function () {
    //     beforeEach(function (done) {
    //         request(app)
    //             .post('/api/user-permissions')
    //             .send({
    //                 user: user,
    //                 permission: permissionTypes[0]
    //             })
    //             .expect(201)
    //             .expect('Content-Type', /json/)
    //             .end((err, res) => {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 newUserPermission = res.body;
    //                 done();
    //             });
    //     });
    //
    //     it('should respond with the newly created userPermission', function () {
    //         expect(newUserPermission.user).to.equal(user._id.toString());
    //         expect(newUserPermission.permission).to.equal(permissionTypes[0]);
    //         expect(newUserPermission.createdBy).to.equal(user._id.toString());
    //     });
    // });

    // describe('GET /api/user-permissions/:id', function () {
    //     var userPermission;
    //
    //     beforeEach(function (done) {
    //         request(app)
    //             .get(`/api/user-permissions/${newUserPermission._id}`)
    //             .expect(200)
    //             .expect('Content-Type', /json/)
    //             .end((err, res) => {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 userPermission = res.body;
    //                 done();
    //             });
    //     });
    //
    //     afterEach(function () {
    //         userPermission = {};
    //     });
    //
    //     it('should respond with the requested userPermission', function () {
    //         expect(userPermission.user).to.equal(user._id.toString());
    //         expect(userPermission.permission).to.equal(permissionTypes[0]);
    //         expect(userPermission.createdBy).to.equal(user._id.toString());
    //     });
    // });

    // describe('PUT /api/user-permissions/:id', function () {
    //     var updatedUserPermission;
    //
    //     beforeEach(function (done) {
    //         request(app)
    //             .put(`/api/user-permissions/${newUserPermission._id}`)
    //             .send({
    //                 user: anotherUser,
    //                 permission: permissionTypes[1],
    //                 createdBy: anotherUser
    //             })
    //             .expect(200)
    //             .expect('Content-Type', /json/)
    //             .end(function (err, res) {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 updatedUserPermission = res.body;
    //                 done();
    //             });
    //     });
    //
    //     afterEach(function () {
    //         updatedUserPermission = {};
    //     });
    //
    //     it('should respond with the updated userPermission', function () {
    //         expect(updatedUserPermission.user).to.equal(anotherUser._id.toString());
    //         expect(updatedUserPermission.permission).to.equal(permissionTypes[1]);
    //         expect(updatedUserPermission.creaetdBy).to.equal(anotherUser._id.toString());
    //     });
    //
    //     it('should respond with the updated userPermission on a subsequent GET', function (done) {
    //         request(app)
    //             .get(`/api/user-permissions/${newUserPermission._id}`)
    //             .expect(200)
    //             .expect('Content-Type', /json/)
    //             .end((err, res) => {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 let userPermission = res.body;
    //
    //                 expect(userPermission.name).to.equal('Updated UserPermission');
    //                 expect(userPermission.info).to.equal('This is the updated userPermission!!!');
    //
    //                 done();
    //             });
    //     });
    // });

    // describe('PATCH /api/user-permissions/:id', function () {
    //     var patchedUserPermission;
    //
    //     beforeEach(function (done) {
    //         request(app)
    //             .patch(`/api/user-permissions/${newUserPermission._id}`)
    //             .send([{
    //                     op: 'replace',
    //                     path: '/name',
    //                     value: 'Patched UserPermission'
    //                 },
    //                 {
    //                     op: 'replace',
    //                     path: '/info',
    //                     value: 'This is the patched userPermission!!!'
    //                 }
    //             ])
    //             .expect(200)
    //             .expect('Content-Type', /json/)
    //             .end(function (err, res) {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 patchedUserPermission = res.body;
    //                 done();
    //             });
    //     });
    //
    //     afterEach(function () {
    //         patchedUserPermission = {};
    //     });
    //
    //     it('should respond with the patched userPermission', function () {
    //         expect(patchedUserPermission.name).to.equal('Patched UserPermission');
    //         expect(patchedUserPermission.info).to.equal('This is the patched userPermission!!!');
    //     });
    // });

    // describe('DELETE /api/user-permissions/:id', function () {
    //     it('should respond with 204 on successful removal', function (done) {
    //         request(app)
    //             .delete(`/api/user-permissions/${newUserPermission._id}`)
    //             .expect(204)
    //             .end(err => {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 done();
    //             });
    //     });
    //
    //     it('should respond with 404 when userPermission does not exist', function (done) {
    //         request(app)
    //             .delete(`/api/user-permissions/${newUserPermission._id}`)
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
