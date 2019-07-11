/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';
import User from '../user/user.model';
import Organization from '../organization/organization.model';
import Tool from '../tool/tool.model';
import {
    adminUser,
    anotherUser,
    authOrganization,
    anotherOrganization,
    authenticateUser
} from '../integration-util';

var newTool;

describe('Tool API:', function () {
    var token;

    before(() => {
        return Tool.deleteMany()
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
        Tool.deleteMany(),
        Organization.deleteMany(),
        User.deleteMany()
    ]));

    describe('GET /api/tools', function () {
        var tools;

        beforeEach(function (done) {
            request(app)
                .get('/api/tools')
                .set('authorization', `Bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    tools = res.body;
                    done();
                });
        });

        it('should respond with JSON array', function () {
            expect(tools).to.be.instanceOf(Array);
        });
    });

    describe('POST /api/tools', function () {
        beforeEach(function (done) {
            request(app)
                .post('/api/tools')
                .set('authorization', `Bearer ${token}`)
                .send({
                    slug: 'new-slug',
                    name: 'New name',
                    description: 'New description',
                    organization: authOrganization._id.toString(),
                    website: 'New website',
                    apiServerUrl: 'New apiServerUrl',
                    apiHealthCheckUrl: 'New apiHealthCheckUrl'
                })
                .expect(201)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    newTool = res.body;
                    done();
                });
        });

        it('should respond with the newly created tool', function () {
            expect(newTool.slug).to.equal('new-slug');
            expect(newTool.name).to.equal('New name');
            expect(newTool.description).to.equal('New description');
            expect(newTool.organization).to.equal(authOrganization._id.toString());
            expect(newTool.website).to.equal('New website');
            expect(newTool.apiServerUrl).to.equal('New apiServerUrl');
            expect(newTool.apiHealthCheckUrl).to.equal('New apiHealthCheckUrl');
            expect(newTool.createdBy).to.equal(adminUser._id.toString());
        });
    });

    describe('GET /api/tools/:id', function () {
        var tool;

        beforeEach(function (done) {
            request(app)
                .get(`/api/tools/${newTool._id}`)
                .set('authorization', `Bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    tool = res.body;
                    done();
                });
        });

        afterEach(function () {
            tool = {};
        });

        it('should respond with the requested tool', function () {
            expect(tool.slug).to.equal('new-slug');
            expect(tool.name).to.equal('New name');
            expect(tool.description).to.equal('New description');
            expect(tool.website).to.equal('New website');
            expect(tool.organization._id).to.equal(authOrganization._id.toString());
            expect(tool.apiServerUrl).to.equal('New apiServerUrl');
            expect(tool.apiHealthCheckUrl).to.equal('New apiHealthCheckUrl');
            expect(tool.createdBy).to.equal(adminUser._id.toString());
        });
    });

    describe('PUT /api/tools/:id', function () {
        var updatedTool;

        beforeEach(function (done) {
            request(app)
                .put(`/api/tools/${newTool._id}`)
                .set('authorization', `Bearer ${token}`)
                .send({
                    slug: 'updated-slug',
                    name: 'Updated name',
                    description: 'Updated description',
                    organization: anotherOrganization._id.toString(),
                    website: 'Updated website',
                    apiServerUrl: 'Updated apiServerUrl',
                    apiHealthCheckUrl: 'Updated apiHealthCheckUrl'
                })
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    updatedTool = res.body;
                    done();
                });
        });

        afterEach(function () {
            updatedTool = {};
        });

        it('should respond with the updated tool', function () {
            expect(updatedTool.slug).to.equal('updated-slug');
            expect(updatedTool.name).to.equal('Updated name');
            expect(updatedTool.description).to.equal('Updated description');
            expect(updatedTool.organization).to.equal(anotherOrganization._id.toString());
            expect(updatedTool.website).to.equal('Updated website');
            expect(updatedTool.apiServerUrl).to.equal('Updated apiServerUrl');
            expect(updatedTool.apiHealthCheckUrl).to.equal('Updated apiHealthCheckUrl');
            expect(updatedTool.createdBy).to.equal(adminUser._id.toString());
        });

        it('should respond with the updated tool on a subsequent GET', function (done) {
            request(app)
                .get(`/api/tools/${newTool._id}`)
                .set('authorization', `Bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    let tool = res.body;

                    expect(tool.slug).to.equal('updated-slug');
                    expect(tool.name).to.equal('Updated name');
                    expect(tool.description).to.equal('Updated description');
                    expect(tool.organization._id).to.equal(anotherOrganization._id.toString());
                    expect(tool.website).to.equal('Updated website');
                    expect(tool.apiServerUrl).to.equal('Updated apiServerUrl');
                    expect(tool.apiHealthCheckUrl).to.equal('Updated apiHealthCheckUrl');
                    expect(tool.createdBy).to.equal(adminUser._id.toString());

                    done();
                });
        });
    });

    describe('PATCH /api/tools/:id', function () {
        var patchedTool;

        beforeEach(function (done) {
            request(app)
                .patch(`/api/tools/${newTool._id}`)
                .set('authorization', `Bearer ${token}`)
                .send([{
                    op: 'replace',
                    path: '/slug',
                    value: 'patched-slug'
                }, {
                    op: 'replace',
                    path: '/name',
                    value: 'Patched name'
                }, {
                    op: 'replace',
                    path: '/description',
                    value: 'Patched description'
                }, {
                    op: 'replace',
                    path: '/organization',
                    value: anotherOrganization._id.toString()
                }, {
                    op: 'replace',
                    path: '/website',
                    value: 'Patched website'
                }, {
                    op: 'replace',
                    path: '/apiServerUrl',
                    value: 'Patched apiServerUrl'
                }, {
                    op: 'replace',
                    path: '/apiHealthCheckUrl',
                    value: 'Patched apiHealthCheckUrl'
                }])
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    patchedTool = res.body;
                    done();
                });
        });

        afterEach(function () {
            patchedTool = {};
        });

        it('should respond with the patched tool', function () {
            expect(patchedTool.slug).to.equal('patched-slug');
            expect(patchedTool.name).to.equal('Patched name');
            expect(patchedTool.description).to.equal('Patched description');
            expect(patchedTool.organization).to.equal(anotherOrganization._id.toString());
            expect(patchedTool.website).to.equal('Patched website');
            expect(patchedTool.apiServerUrl).to.equal('Patched apiServerUrl');
            expect(patchedTool.apiHealthCheckUrl).to.equal('Patched apiHealthCheckUrl');
            expect(patchedTool.createdBy).to.equal(adminUser._id.toString());
        });
    });

    describe('DELETE /api/tools/:id', function () {
        it('should respond with 204 on successful removal', function (done) {
            request(app)
                .delete(`/api/tools/${newTool._id}`)
                .set('authorization', `Bearer ${token}`)
                .expect(204)
                .end(err => {
                    if (err) {
                        return done(err);
                    }
                    done();
                });
        });

        it('should respond with 404 when tool does not exist', function (done) {
            request(app)
                .delete(`/api/tools/${newTool._id}`)
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
