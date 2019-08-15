/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';
import User from '../user/user.model';
import Organization from '../organization/organization.model';
import {
    organizations
} from '../../config/seeds/default/organizations';

var newMessage;

describe('Message API:', function () {
    var user;
    var token;

    // Clear users before testing, create user and authenticate it
    before(() => {
        return Organization.deleteMany()
            .then(() => User.deleteMany())
            .then(() => Organization.create(organizations))
            .then(() => {
                user = new User({
                    name: 'Fake User',
                    email: 'test@sagebase.org',  // domain must be part of an active organization
                    password: 'password',
                    username: 'test'
                });

                return user.save();
            })
            .then(user => {
                return request(app)
                    .post('/auth/local')
                    .send({
                        email: 'test@sagebase.org',
                        password: 'password',
                        username: 'test'
                    })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .then(res => token = res.body.token);
            });
    });

    // Clear users after testing
    after(() => Promise.all([
        User.deleteMany(),
        Organization.deleteMany()
    ]));

    describe('GET /api/messages', function () {
        var messages;

        beforeEach(function (done) {
            request(app)
                .get('/api/messages')
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    messages = res.body;
                    done();
                });
        });

        it('should respond with JSON array', function () {
            expect(messages).to.be.instanceOf(Array);
        });
    });

    describe('POST /api/messages', function () {

        beforeEach(function (done) {
            request(app)
                .post('/api/messages')
                .set('authorization', `Bearer ${token}`)
                .send({
                    body: 'New body',
                })
                .expect(201)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    newMessage = res.body;
                    done();
                });
        });

        it('should respond with the newly created message', function () {
            expect(newMessage.body).to.equal('New body');
        });
    });

    describe('GET /api/messages/:id', function () {
        var message;

        beforeEach(function (done) {
            request(app)
                .get(`/api/messages/${newMessage._id}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    message = res.body;
                    done();
                });
        });

        afterEach(function () {
            message = {};
        });

        it('should respond with the requested message', function () {
            expect(message.body).to.equal('New body');
        });
    });

    // describe('PUT /api/messages/:id', function() {
    //   var updatedMessage;
    //
    //   beforeEach(function(done) {
    //     request(app)
    //       .put(`/api/messages/${newMessage._id}`)
    //       .send({
    //         name: 'Updated Message',
    //         info: 'This is the updated message!!!'
    //       })
    //       .expect(200)
    //       .expect('Content-Type', /json/)
    //       .end(function(err, res) {
    //         if(err) {
    //           return done(err);
    //         }
    //         updatedMessage = res.body;
    //         done();
    //       });
    //   });
    //
    //   afterEach(function() {
    //     updatedMessage = {};
    //   });
    //
    //   it('should respond with the updated message', function() {
    //     expect(updatedMessage.name).to.equal('Updated message');
    //   });
    //
    //   it('should respond with the updated message on a subsequent GET', function(done) {
    //     request(app)
    //       .get(`/api/messages/${newMessage._id}`)
    //       .expect(200)
    //       .expect('Content-Type', /json/)
    //       .end((err, res) => {
    //         if(err) {
    //           return done(err);
    //         }
    //         let message = res.body;
    //
    //         expect(message.name).to.equal('Updated Message');
    //         expect(message.info).to.equal('This is the updated message!!!');
    //
    //         done();
    //       });
    //   });
    // });

    describe('PATCH /api/messages/:id', function () {
        var patchedMessage;

        beforeEach(function (done) {
            request(app)
                .patch(`/api/messages/${newMessage._id}`)
                .send([{
                        op: 'replace',
                        path: '/body',
                        value: 'Patched body'
                    },
                    // { op: 'replace', path: '/info', value: 'This is the patched message!!!' }
                ])
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    patchedMessage = res.body;
                    done();
                });
        });

        afterEach(function () {
            patchedMessage = {};
        });

        it('should respond with the patched message', function () {
            expect(patchedMessage.body).to.equal('Patched body');
        });
    });

    describe('DELETE /api/messages/:id', function () {
        it('should respond with 204 on successful removal', function (done) {
            request(app)
                .delete(`/api/messages/${newMessage._id}`)
                .expect(204)
                .end(err => {
                    if (err) {
                        return done(err);
                    }
                    done();
                });
        });

        it('should respond with 404 when message does not exist', function (done) {
            request(app)
                .delete(`/api/messages/${newMessage._id}`)
                .expect(404)
                .end(err => {
                    if (err) {
                        return done(err);
                    }
                    done();
                });
        });
    });

    // Threads
    // POST /messages/threads/  -> Create a new thread and a new message ID that is not associated with an entity ID
    // GET /messages/threads/   -> Get all threads that are not associated with an entity ID
    // POST /messages/threads/:id    -> Add a Message to a specific thread ID not associated with an entity ID
    // GET /messages/threads/messages/:id   -> Get messages from a specific thread ID not associated with an entity ID
    // GET /messages/threads/entity/:entityId   -> Get all threads for a specific entity ID

});
