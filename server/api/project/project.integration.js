/* globals describe, expect, it, before, beforeEach, after, afterEach */

var app = require('../..');
import request from 'supertest';
import User from '../user/user.model';
import Organization from '../organization/organization.model';
import Project from './project.model';
import { adminUser, anotherUser, authOrganization, anotherOrganization, authenticateUser } from '../integration-util';
import { entityVisibility } from '../../config/environment';

var newProject;

describe.only('Project API:', function () {
    var token;

    before(() =>
        Project.deleteMany()
            .then(() => Organization.deleteMany())
            .then(() => User.deleteMany())
            .then(() => User.create([adminUser, anotherUser]))
            .then(() => Organization.create([authOrganization, anotherOrganization]))
            .then(authenticateUser(app, adminUser))
            .then(res => {
                token = res;
            })
    );

    after(() => Promise.all([Project.deleteMany(), Organization.deleteMany(), User.deleteMany()]));

    describe('GET /api/projects', function () {
        var response;

        beforeEach(function (done) {
            request(app)
                .get('/api/projects')
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

        it('should respond with a query-list-response object', function () {
            expect(response).to.have.property('count');
            expect(response).to.have.property('results');
            expect(response.results).to.be.instanceOf(Array);
        });
    });

    describe('POST /api/projects', function () {
        beforeEach(function (done) {
            request(app)
                .post('/api/projects')
                .set('authorization', `Bearer ${token}`)
                .send({
                    title: 'New title',
                    description: 'New description',
                    visibility: entityVisibility.PRIVATE.value,
                })
                .expect(201)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    newProject = res.body;
                    done();
                });
        });

        it('should respond with the newly created project', function () {
            expect(newProject.title).to.equal('New title');
            expect(newProject.description).to.equal('New description');
            expect(newProject.visibility).to.equal(entityVisibility.PRIVATE.value);
            expect(newProject.createdBy).to.equal(adminUser._id.toString());
        });
    });

    describe('GET /api/projects/:id', function () {
        var project;

        beforeEach(function (done) {
            request(app)
                .get(`/api/projects/${newProject._id}`)
                .set('authorization', `Bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    project = res.body;
                    done();
                });
        });

        afterEach(function () {
            project = {};
        });

        it('should respond with the requested project', function () {
            expect(project.title).to.equal('New title');
            expect(project.description).to.equal('New description');
            expect(project.visibility).to.equal(entityVisibility.PRIVATE.value);
            expect(project.createdBy).to.equal(adminUser._id.toString());
        });
    });

    describe('PATCH /api/projects/:id', function () {
        var patchedProject;

        beforeEach(function (done) {
            request(app)
                .patch(`/api/projects/${newProject._id}`)
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
                        path: '/visibility',
                        value: entityVisibility.PUBLIC.value,
                    },
                ])
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    patchedProject = res.body;
                    done();
                });
        });

        afterEach(function () {
            patchedProject = {};
        });

        it('should respond with the patched project', function () {
            expect(patchedProject.title).to.equal('Patched title');
            expect(patchedProject.description).to.equal('Patched description');
            expect(patchedProject.visibility).to.equal(entityVisibility.PUBLIC.value);
            expect(patchedProject.createdBy).to.equal(adminUser._id.toString());
        });
    });

    describe('DELETE /api/projects/:id', function () {
        it('should respond with 204 on successful removal', function (done) {
            request(app)
                .delete(`/api/projects/${newProject._id}`)
                .set('authorization', `Bearer ${token}`)
                .expect(204)
                .end(err => {
                    if (err) {
                        return done(err);
                    }
                    done();
                });
        });

        it('should respond with 404 when project does not exist', function (done) {
            request(app)
                .delete(`/api/projects/${newProject._id}`)
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
