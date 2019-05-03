/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';
import mongoose from 'mongoose';
import User from '../user/user.model';

var newOrganization;

describe('Organization API:', function () {
    var user;
    var anotherUser;

    // Clear users before testing
    before(function () {
        return User.deleteMany().then(function () {
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
        });
    });

    // Clear users after testing
    after(function () {
        return User.deleteMany();
    });

    describe('GET /api/organizations', function () {
        var organizations;

        beforeEach(function (done) {
            request(app)
                .get('/api/organizations')
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    organizations = res.body;
                    done();
                });
        });

        it('should respond with JSON array', function () {
            expect(organizations).to.be.instanceOf(Array);
        });
    });

    describe('POST /api/organizations', function () {
        beforeEach(function (done) {
            request(app)
                .post('/api/organizations')
                .send({
                    name: 'New name',
                    website: 'New website',
                    createdBy: user._id.toString()
                })
                .expect(201)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    newOrganization = res.body;
                    done();
                });
        });

        it('should respond with the newly created organization', function () {
            expect(newOrganization.name).to.equal('New name');
            expect(newOrganization.website).to.equal('New website');
            expect(newOrganization.createdBy).to.equal(user._id.toString());
        });
    });

    describe('GET /api/organizations/:id', function () {
        var organization;

        beforeEach(function (done) {
            request(app)
                .get(`/api/organizations/${newOrganization._id}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    organization = res.body;
                    done();
                });
        });

        afterEach(function () {
            organization = {};
        });

        it('should respond with the requested organization', function () {
            expect(organization.name).to.equal('New name');
            expect(organization.website).to.equal('New website');
            expect(organization.createdBy).to.equal(user._id.toString());
        });
    });

    describe('PUT /api/organizations/:id', function () {
        var updatedOrganization;

        beforeEach(function (done) {
            request(app)
                .put(`/api/organizations/${newOrganization._id}`)
                .send({
                    name: 'Updated name',
                    website: 'Updated website',
                    createdBy: anotherUser._id.toString()
                })
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    updatedOrganization = res.body;
                    done();
                });
        });

        afterEach(function () {
            updatedOrganization = {};
        });

        it('should respond with the updated organization', function () {
            expect(updatedOrganization.name).to.equal('Updated name');
            expect(updatedOrganization.website).to.equal('Updated website');
            expect(updatedOrganization.createdBy).to.equal(anotherUser._id.toString());
        });

        it('should respond with the updated organization on a subsequent GET', function (done) {
            request(app)
                .get(`/api/organizations/${newOrganization._id}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    let organization = res.body;

                    expect(organization.name).to.equal('Updated name');
                    expect(organization.website).to.equal('Updated website');
                    expect(organization.createdBy).to.equal(anotherUser._id.toString());

                    done();
                });
        });
    });

    describe('PATCH /api/organizations/:id', function () {
        var patchedOrganization;

        beforeEach(function (done) {
            request(app)
                .patch(`/api/organizations/${newOrganization._id}`)
                .send([{
                        op: 'replace',
                        path: '/name',
                        value: 'Patched name'
                    },
                    {
                        op: 'replace',
                        path: '/website',
                        value: 'Patched website'
                    },
                    {
                        op: 'replace',
                        path: '/createdBy',
                        value: anotherUser._id.toString()
                    }
                ])
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    patchedOrganization = res.body;
                    done();
                });
        });

        afterEach(function () {
            patchedOrganization = {};
        });

        it('should respond with the patched organization', function () {
            expect(patchedOrganization.name).to.equal('Patched name');
            expect(patchedOrganization.website).to.equal('Patched website');
            expect(patchedOrganization.createdBy).to.equal(anotherUser._id.toString());
        });
    });

    describe('DELETE /api/organizations/:id', function () {
        it('should respond with 204 on successful removal', function (done) {
            request(app)
                .delete(`/api/organizations/${newOrganization._id}`)
                .expect(204)
                .end(err => {
                    if (err) {
                        return done(err);
                    }
                    done();
                });
        });

        it('should respond with 404 when organization does not exist', function (done) {
            request(app)
                .delete(`/api/organizations/${newOrganization._id}`)
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
