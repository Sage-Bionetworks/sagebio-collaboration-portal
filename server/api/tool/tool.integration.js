/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';
import mongoose from 'mongoose';

var newTool;

describe('Tool API:', function () {
    describe('GET /api/tools', function () {
        var tools;

        beforeEach(function (done) {
            request(app)
                .get('/api/tools')
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
                .send({
                    _id: new mongoose.Types.ObjectId(),
                    name: 'New Tool',
                    description: 'New description'
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
            expect(newTool.name).to.equal('New Tool');
            expect(newTool.description).to.equal('New description');
        });
    });

    describe('GET /api/tools/:id', function () {
        var tool;

        beforeEach(function (done) {
            request(app)
                .get(`/api/tools/${newTool._id}`)
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
            expect(tool.name).to.equal('New Tool');
            expect(tool.description).to.equal('New description');
        });
    });

    describe('PUT /api/tools/:id', function () {
        var updatedTool;

        beforeEach(function (done) {
            request(app)
                .put(`/api/tools/${newTool._id}`)
                .send({
                    name: 'Updated Tool',
                    description: 'Updated description'
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
            expect(updatedTool.name).to.equal('Updated Tool');
            expect(updatedTool.description).to.equal('Updated description');
        });

        it('should respond with the updated tool on a subsequent GET', function (done) {
            request(app)
                .get(`/api/tools/${newTool._id}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    let tool = res.body;

                    expect(tool.name).to.equal('Updated Tool');
                    expect(tool.description).to.equal('Updated description');

                    done();
                });
        });
    });

    describe('PATCH /api/tools/:id', function () {
        var patchedTool;

        beforeEach(function (done) {
            request(app)
                .patch(`/api/tools/${newTool._id}`)
                .send([{
                    op: 'replace',
                    path: '/name',
                    value: 'Patched Tool'
                }, {
                    op: 'replace',
                    path: '/description',
                    value: 'Patched description'
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
            expect(patchedTool.name).to.equal('Patched Tool');
            expect(patchedTool.description).to.equal('Patched description');
        });
    });

    describe('DELETE /api/tools/:id', function () {
        it('should respond with 204 on successful removal', function (done) {
            request(app)
                .delete(`/api/tools/${newTool._id}`)
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
