/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';
import User from '../user/user.model';
import Organization from './organization.model';
import {
    adminUser,
    anotherUser,
    authOrganization,
    anotherOrganization,
    authenticateUser
} from '../integration-util';

var newOrganization;

describe('Organization API:', function () {
    var token;

    before(() => {
        return User.deleteMany()
            .then(() => Organization.deleteMany())
            .then(() => User.create([
                adminUser,
                anotherUser
            ]))
            .then(() => Organization.create([
                authOrganization
            ]))
            .then(authenticateUser(app, adminUser))
            .then(res => token = res);
    });

    after(() => Promise.all([
        Organization.deleteMany(),
        User.deleteMany()
    ]));

    describe('GET /api/organizations', function () {
        var organizations;

        beforeEach(function (done) {
            request(app)
                .get('/api/organizations')
                .set('authorization', `Bearer ${token}`)
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
                .set('authorization', `Bearer ${token}`)
                .send({
                    name: 'New name',
                    website: 'New website',
                    domains: [
                        'new.org'
                    ],
                    active: true
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
            expect(newOrganization.domains).to.deep.equal([
                'new.org'
            ]);
            expect(newOrganization.createdBy).to.equal(adminUser._id.toString());
        });
    });

    describe('GET /api/organizations/:id', function () {
        var organization;

        beforeEach(function (done) {
            request(app)
                .get(`/api/organizations/${newOrganization._id}`)
                .set('authorization', `Bearer ${token}`)
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
            expect(organization.domains).to.deep.equal([
                'new.org'
            ]);
            expect(organization.createdBy).to.equal(adminUser._id.toString());
        });
    });

    describe('PUT /api/organizations/:id', function () {
        var updatedOrganization;

        beforeEach(function (done) {
            request(app)
                .put(`/api/organizations/${newOrganization._id}`)
                .set('authorization', `Bearer ${token}`)
                .send({
                    name: 'Updated name',
                    website: 'Updated website',
                    domains: [
                        'updated.org'
                    ],
                    active: true
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
            expect(updatedOrganization.domains).to.deep.equal([
                'updated.org'
            ]);
            expect(updatedOrganization.createdBy).to.equal(adminUser._id.toString());
        });

        it('should respond with the updated organization on a subsequent GET', function (done) {
            request(app)
                .get(`/api/organizations/${newOrganization._id}`)
                .set('authorization', `Bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    let organization = res.body;

                    expect(organization.name).to.equal('Updated name');
                    expect(organization.website).to.equal('Updated website');
                    expect(organization.domains).to.deep.equal([
                        'updated.org'
                    ]);
                    expect(organization.createdBy).to.equal(adminUser._id.toString());

                    done();
                });
        });
    });

    describe('PATCH /api/organizations/:id', function () {
        var patchedOrganization;

        beforeEach(function (done) {
            request(app)
                .patch(`/api/organizations/${newOrganization._id}`)
                .set('authorization', `Bearer ${token}`)
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
                        path: '/domains',
                        value: [
                            'patched.org'
                        ]
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
            expect(patchedOrganization.domains).to.deep.equal([
                'patched.org'
            ]);
            expect(patchedOrganization.createdBy).to.equal(adminUser._id.toString());
        });
    });

    describe('DELETE /api/organizations/:id', function () {
        it('should respond with 204 on successful removal', function (done) {
            request(app)
                .delete(`/api/organizations/${newOrganization._id}`)
                .set('authorization', `Bearer ${token}`)
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
