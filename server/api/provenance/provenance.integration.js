/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newProvenance;

describe('Provenance API:', function () {
    // describe('GET /api/provenance', function () {
    //     var provenances;
    //
    //     beforeEach(function (done) {
    //         request(app)
    //             .get('/api/provenance')
    //             .expect(200)
    //             .expect('Content-Type', /json/)
    //             .end((err, res) => {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 provenances = res.body;
    //                 done();
    //             });
    //     });
    //
    //     it('should respond with JSON array', function () {
    //         expect(provenances).to.be.instanceOf(Array);
    //     });
    // });

    // describe('POST /api/provenance', function () {
    //     beforeEach(function (done) {
    //         request(app)
    //             .post('/api/provenance')
    //             .send({
    //                 name: 'New Provenance',
    //                 info: 'This is the brand new provenance!!!'
    //             })
    //             .expect(201)
    //             .expect('Content-Type', /json/)
    //             .end((err, res) => {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 newProvenance = res.body;
    //                 done();
    //             });
    //     });
    //
    //     it('should respond with the newly created provenance', function () {
    //         expect(newProvenance.name).to.equal('New Provenance');
    //         expect(newProvenance.info).to.equal('This is the brand new provenance!!!');
    //     });
    // });

    // describe('GET /api/provenance/:id', function () {
    //     var provenance;
    //
    //     beforeEach(function (done) {
    //         request(app)
    //             .get(`/api/provenance/${newProvenance._id}`)
    //             .expect(200)
    //             .expect('Content-Type', /json/)
    //             .end((err, res) => {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 provenance = res.body;
    //                 done();
    //             });
    //     });
    //
    //     afterEach(function () {
    //         provenance = {};
    //     });
    //
    //     it('should respond with the requested provenance', function () {
    //         expect(provenance.name).to.equal('New Provenance');
    //         expect(provenance.info).to.equal('This is the brand new provenance!!!');
    //     });
    // });

    // describe('PUT /api/provenance/:id', function () {
    //     var updatedProvenance;
    //
    //     beforeEach(function (done) {
    //         request(app)
    //             .put(`/api/provenance/${newProvenance._id}`)
    //             .send({
    //                 name: 'Updated Provenance',
    //                 info: 'This is the updated provenance!!!'
    //             })
    //             .expect(200)
    //             .expect('Content-Type', /json/)
    //             .end(function (err, res) {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 updatedProvenance = res.body;
    //                 done();
    //             });
    //     });
    //
    //     afterEach(function () {
    //         updatedProvenance = {};
    //     });
    //
    //     it('should respond with the updated provenance', function () {
    //         expect(updatedProvenance.name).to.equal('Updated Provenance');
    //         expect(updatedProvenance.info).to.equal('This is the updated provenance!!!');
    //     });
    //
    //     it('should respond with the updated provenance on a subsequent GET', function (done) {
    //         request(app)
    //             .get(`/api/provenance/${newProvenance._id}`)
    //             .expect(200)
    //             .expect('Content-Type', /json/)
    //             .end((err, res) => {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 let provenance = res.body;
    //
    //                 expect(provenance.name).to.equal('Updated Provenance');
    //                 expect(provenance.info).to.equal('This is the updated provenance!!!');
    //
    //                 done();
    //             });
    //     });
    // });

    // describe('PATCH /api/provenance/:id', function () {
    //     var patchedProvenance;
    //
    //     beforeEach(function (done) {
    //         request(app)
    //             .patch(`/api/provenance/${newProvenance._id}`)
    //             .send([{
    //                     op: 'replace',
    //                     path: '/name',
    //                     value: 'Patched Provenance'
    //                 },
    //                 {
    //                     op: 'replace',
    //                     path: '/info',
    //                     value: 'This is the patched provenance!!!'
    //                 }
    //             ])
    //             .expect(200)
    //             .expect('Content-Type', /json/)
    //             .end(function (err, res) {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 patchedProvenance = res.body;
    //                 done();
    //             });
    //     });
    //
    //     afterEach(function () {
    //         patchedProvenance = {};
    //     });
    //
    //     it('should respond with the patched provenance', function () {
    //         expect(patchedProvenance.name).to.equal('Patched Provenance');
    //         expect(patchedProvenance.info).to.equal('This is the patched provenance!!!');
    //     });
    // });

    // describe('DELETE /api/provenance/:id', function () {
    //     it('should respond with 204 on successful removal', function (done) {
    //         request(app)
    //             .delete(`/api/provenance/${newProvenance._id}`)
    //             .expect(204)
    //             .end(err => {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 done();
    //             });
    //     });
    //
    //     it('should respond with 404 when provenance does not exist', function (done) {
    //         request(app)
    //             .delete(`/api/provenance/${newProvenance._id}`)
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
