/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';
import User from '../user/user.model';

var newProject;

describe('Project API:', function () {
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

    describe('GET /api/projects', function () {
        var projects;

        beforeEach(function (done) {
            request(app)
                .get('/api/projects')
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    projects = res.body;
                    done();
                });
        });

        it('should respond with JSON array', function () {
            expect(projects).to.be.instanceOf(Array);
        });
    });

    describe('POST /api/projects', function () {
        beforeEach(function (done) {
            request(app)
                .post('/api/projects')
                .send({
                    name: 'New name',
                    description: 'New description',
                    createdBy: user._id.toString()
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
            expect(newProject.name).to.equal('New name');
            expect(newProject.description).to.equal('New description');
            expect(newProject.createdBy).to.equal(user._id.toString());
        });
    });

    describe('GET /api/projects/:id', function () {
        var project;

        beforeEach(function (done) {
            request(app)
                .get(`/api/projects/${newProject._id}`)
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
            expect(project.name).to.equal('New name');
            expect(project.description).to.equal('New description');
            expect(project.createdBy).to.equal(user._id.toString());
        });
    });

    describe('PUT /api/projects/:id', function () {
        var updatedProject;

        beforeEach(function (done) {
            request(app)
                .put(`/api/projects/${newProject._id}`)
                .send({
                    name: 'Updated name',
                    description: 'Updated description',
                    createdBy: anotherUser._id.toString()
                })
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    updatedProject = res.body;
                    done();
                });
        });

        afterEach(function () {
            updatedProject = {};
        });

        it('should respond with the updated project', function () {
            expect(updatedProject.name).to.equal('Updated name');
            expect(updatedProject.description).to.equal('Updated description');
            expect(updatedProject.createdBy).to.equal(anotherUser._id.toString());
        });

        it('should respond with the updated project on a subsequent GET', function (done) {
            request(app)
                .get(`/api/projects/${newProject._id}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    let project = res.body;

                    expect(project.name).to.equal('Updated name');
                    expect(project.description).to.equal('Updated description');
                    expect(project.createdBy).to.equal(anotherUser._id.toString());

                    done();
                });
        });
    });

    describe('PATCH /api/projects/:id', function () {
        var patchedProject;

        beforeEach(function (done) {
            request(app)
                .patch(`/api/projects/${newProject._id}`)
                .send([{
                        op: 'replace',
                        path: '/name',
                        value: 'Patched name'
                    }, {
                        op: 'replace',
                        path: '/description',
                        value: 'Patched description'
                    }, {
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
                    patchedProject = res.body;
                    done();
                });
        });

        afterEach(function () {
            patchedProject = {};
        });

        it('should respond with the patched project', function () {
            expect(patchedProject.name).to.equal('Patched name');
            expect(patchedProject.description).to.equal('Patched description');
            expect(patchedProject.createdBy).to.equal(anotherUser._id.toString());
        });
    });

    describe('DELETE /api/projects/:id', function () {
        it('should respond with 204 on successful removal', function (done) {
            request(app)
                .delete(`/api/projects/${newProject._id}`)
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
