/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';
import mongoose from 'mongoose';

var newResource;

describe('Resource API:', function () {
    // describe('GET /api/resources', function () {
    //     var resources;

    //     beforeEach(function (done) {
    //         request(app)
    //             .get('/api/resources')
    //             .expect(200)
    //             .expect('Content-Type', /json/)
    //             .end((err, res) => {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 resources = res.body;
    //                 done();
    //             });
    //     });

    //     it('should respond with JSON array', function () {
    //         expect(resources).to.be.instanceOf(Array);
    //     });
    // });

    // describe('POST /api/resources', function () {
    //     beforeEach(function (done) {
    //         request(app)
    //             .post('/api/resources')
    //             .send({
    //                 _id: new mongoose.Types.ObjectId(),
    //                 title: 'New Resource',
    //             })
    //             .expect(201)
    //             .expect('Content-Type', /json/)
    //             .end((err, res) => {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 newResource = res.body;
    //                 done();
    //             });
    //     });

    //     it('should respond with the newly created resource', function () {
    //         expect(newResource.title).to.equal('New Resource');
    //     });
    // });

    // describe('GET /api/resources/:id', function () {
    //     var resource;

    //     beforeEach(function (done) {
    //         request(app)
    //             .get(`/api/resources/${newResource._id}`)
    //             .expect(200)
    //             .expect('Content-Type', /json/)
    //             .end((err, res) => {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 resource = res.body;
    //                 done();
    //             });
    //     });

    //     afterEach(function () {
    //         resource = {};
    //     });

    //     it('should respond with the requested resource', function () {
    //         expect(resource.title).to.equal('New Resource');
    //     });
    // });

    // describe('PUT /api/resources/:id', function () {
    //     var updatedResource;

    //     beforeEach(function (done) {
    //         request(app)
    //             .put(`/api/resources/${newResource._id}`)
    //             .send({
    //                 title: 'Updated Resource',
    //             })
    //             .expect(200)
    //             .expect('Content-Type', /json/)
    //             .end(function (err, res) {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 updatedResource = res.body;
    //                 done();
    //             });
    //     });

    //     afterEach(function () {
    //         updatedResource = {};
    //     });

    //     it('should respond with the updated resource', function () {
    //         expect(updatedResource.title).to.equal('Updated Resource');
    //     });

    //     it('should respond with the updated resource on a subsequent GET', function (done) {
    //         request(app)
    //             .get(`/api/resources/${newResource._id}`)
    //             .expect(200)
    //             .expect('Content-Type', /json/)
    //             .end((err, res) => {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 let resource = res.body;

    //                 expect(resource.title).to.equal('Updated Resource');

    //                 done();
    //             });
    //     });
    // });

    // describe('PATCH /api/resources/:id', function () {
    //     var patchedResource;

    //     beforeEach(function (done) {
    //         request(app)
    //             .patch(`/api/resources/${newResource._id}`)
    //             .send([{
    //                 op: 'replace',
    //                 path: '/title',
    //                 value: 'Patched Resource'
    //             }])
    //             .expect(200)
    //             .expect('Content-Type', /json/)
    //             .end(function (err, res) {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 patchedResource = res.body;
    //                 done();
    //             });
    //     });

    //     afterEach(function () {
    //         patchedResource = {};
    //     });

    //     it('should respond with the patched resource', function () {
    //         expect(patchedResource.title).to.equal('Patched Resource');
    //     });
    // });

    // describe('DELETE /api/resources/:id', function () {
    //     it('should respond with 204 on successful removal', function (done) {
    //         request(app)
    //             .delete(`/api/resources/${newResource._id}`)
    //             .expect(204)
    //             .end(err => {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 done();
    //             });
    //     });

    //     it('should respond with 404 when resource does not exist', function (done) {
    //         request(app)
    //             .delete(`/api/resources/${newResource._id}`)
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
