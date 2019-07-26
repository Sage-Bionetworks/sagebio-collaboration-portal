/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';
import User from '../user/user.model';
import Organization from '../organization/organization.model';
import Project from './project.model';
import {
    adminUser,
    anotherUser,
    authOrganization,
    anotherOrganization,
    authenticateUser
} from '../integration-util';

var newProject;

describe('Project API:', function () {
    var token;

    before(() => {
        return Project.deleteMany()
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
        Project.deleteMany(),
        Organization.deleteMany(),
        User.deleteMany()
    ]));

    // describe('GET /api/projects', function () {
    //     var projects;
    //
    //     beforeEach(function (done) {
    //         request(app)
    //             .get('/api/projects')
    //             .expect(200)
    //             .expect('Content-Type', /json/)
    //             .end((err, res) => {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 projects = res.body;
    //                 done();
    //             });
    //     });
    //
    //     it('should respond with JSON array', function () {
    //         expect(projects).to.be.instanceOf(Array);
    //     });
    // });

    // describe('POST /api/projects', function () {
    //     beforeEach(function (done) {
    //         request(app)
    //             .post('/api/projects')
    //             .set('authorization', `Bearer ${token}`)
    //             .send({
    //                 name: 'New name',
    //                 description: 'New description',
    //                 visibility: 'Private'
    //             })
    //             .expect(201)
    //             .expect('Content-Type', /json/)
    //             .end((err, res) => {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 newProject = res.body;
    //                 done();
    //             });
    //     });
    //
    //     it('should respond with the newly created project', function () {
    //         expect(newProject.name).to.equal('New name');
    //         expect(newProject.description).to.equal('New description');
    //         expect(newProject.visibility).to.equal('Private');
    //         expect(newProject.createdBy).to.equal(adminUser._id.toString());
    //     });
    // });

    // describe('GET /api/projects/:id', function () {
    //     var project;
    //
    //     beforeEach(function (done) {
    //         request(app)
    //             .get(`/api/projects/${newProject._id}`)
    //             .expect(200)
    //             .expect('Content-Type', /json/)
    //             .end((err, res) => {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 project = res.body;
    //                 done();
    //             });
    //     });
    //
    //     afterEach(function () {
    //         project = {};
    //     });
    //
    //     it('should respond with the requested project', function () {
    //         expect(project.name).to.equal('New name');
    //         expect(project.description).to.equal('New description');
    //         expect(project.visibility).to.equal('Private');
    //         expect(project.createdBy).to.equal(adminUser._id.toString());
    //     });
    // });

    // describe('PATCH /api/projects/:id', function () {
    //     var patchedProject;
    //
    //     beforeEach(function (done) {
    //         request(app)
    //             .patch(`/api/projects/${newProject._id}`)
    //             .send([{
    //                 op: 'replace',
    //                 path: '/name',
    //                 value: 'Patched name'
    //             }, {
    //                 op: 'replace',
    //                 path: '/description',
    //                 value: 'Patched description'
    //             }, {
    //                 op: 'replace',
    //                 path: '/visibility',
    //                 value: 'Public'
    //             }])
    //             .expect(200)
    //             .expect('Content-Type', /json/)
    //             .end(function (err, res) {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 patchedProject = res.body;
    //                 done();
    //             });
    //     });
    //
    //     afterEach(function () {
    //         patchedProject = {};
    //     });
    //
    //     it('should respond with the patched project', function () {
    //         expect(patchedProject.name).to.equal('Patched name');
    //         expect(patchedProject.description).to.equal('Patched description');
    //         expect(patchedProject.visibility).to.equal('Public');
    //         expect(patchedProject.createdBy).to.equal(adminUser._id.toString());
    //     });
    // });

    // describe('DELETE /api/projects/:id', function () {
    //     it('should respond with 204 on successful removal', function (done) {
    //         request(app)
    //             .delete(`/api/projects/${newProject._id}`)
    //             .expect(204)
    //             .end(err => {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 done();
    //             });
    //     });
    //
    //     it('should respond with 404 when project does not exist', function (done) {
    //         request(app)
    //             .delete(`/api/projects/${newProject._id}`)
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
