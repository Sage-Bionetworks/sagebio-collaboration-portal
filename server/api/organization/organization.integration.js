/* globals describe, expect, it, before, beforeEach, after, afterEach */

var app = require('../..');
import request from 'supertest';
import User from '../user/user.model';
import Organization from './organization.model';
import { adminUser, anotherUser, authOrganization, authenticateUser } from '../integration-util';

var newOrganization;

describe('Organization API:', function () {
    var token;

    before(() => User.deleteMany()
        .then(() => Organization.deleteMany())
        .then(() => User.create([adminUser, anotherUser]))
        .then(() => Organization.create([authOrganization]))
        .then(authenticateUser(app, adminUser))
        .then(res => {
            token = res;
        }));

    after(() => Promise.all([Organization.deleteMany(), User.deleteMany()]));

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
                    title: 'New title',
                    description: 'New description',
                    website: 'New website',
                    domains: ['new.org'],
                    active: true,
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
            expect(newOrganization.title).to.equal('New title');
            expect(newOrganization.description).to.equal('New description');
            expect(newOrganization.website).to.equal('New website');
            expect(newOrganization.domains).to.deep.equal(['new.org']);
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
            expect(organization.title).to.equal('New title');
            expect(organization.description).to.equal('New description');
            expect(organization.website).to.equal('New website');
            expect(organization.domains).to.deep.equal(['new.org']);
            expect(organization.createdBy).to.equal(adminUser._id.toString());
        });
    });

    describe('PATCH /api/organizations/:id', function () {
        var patchedOrganization;

        beforeEach(function (done) {
            request(app)
                .patch(`/api/organizations/${newOrganization._id}`)
                .set('authorization', `Bearer ${token}`)
                .send([
                    {
                        op: 'replace',
                        path: '/title',
                        value: 'Patched title',
                    },
                    {
                        op: 'replace',
                        path: '/description',
                        value: 'Patched description',
                    },
                    {
                        op: 'replace',
                        path: '/website',
                        value: 'Patched website',
                    },
                    {
                        op: 'replace',
                        path: '/domains',
                        value: ['patched.org'],
                    },
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
            expect(patchedOrganization.title).to.equal('Patched title');
            expect(patchedOrganization.description).to.equal('Patched description');
            expect(patchedOrganization.website).to.equal('Patched website');
            expect(patchedOrganization.domains).to.deep.equal(['patched.org']);
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
