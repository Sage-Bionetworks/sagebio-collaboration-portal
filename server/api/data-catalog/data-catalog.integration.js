/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';
import mongoose from 'mongoose';

var newDataCatalog;

describe('DataCatalog API:', function () {
    describe('GET /api/data-catalogs', function () {
        var dataCatalogs;

        beforeEach(function (done) {
            request(app)
                .get('/api/data-catalogs')
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    dataCatalogs = res.body;
                    done();
                });
        });

        it('should respond with JSON array', function () {
            expect(dataCatalogs).to.be.instanceOf(Array);
        });
    });

    describe('POST /api/data-catalogs', function () {
        beforeEach(function (done) {
            request(app)
                .post('/api/data-catalogs')
                .send({
                    _id: new mongoose.Types.ObjectId(),
                    name: 'New DataCatalog',
                    description: 'New description'
                })
                .expect(201)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    newDataCatalog = res.body;
                    done();
                });
        });

        it('should respond with the newly created dataCatalog', function () {
            expect(newDataCatalog.name).to.equal('New DataCatalog');
            expect(newDataCatalog.description).to.equal('New description');
        });
    });

    describe('GET /api/data-catalogs/:id', function () {
        var dataCatalog;

        beforeEach(function (done) {
            request(app)
                .get(`/api/data-catalogs/${newDataCatalog._id}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    dataCatalog = res.body;
                    done();
                });
        });

        afterEach(function () {
            dataCatalog = {};
        });

        it('should respond with the requested dataCatalog', function () {
            expect(dataCatalog.name).to.equal('New DataCatalog');
            expect(dataCatalog.description).to.equal('New description');
        });
    });

    describe('PUT /api/data-catalogs/:id', function () {
        var updatedDataCatalog;

        beforeEach(function (done) {
            request(app)
                .put(`/api/data-catalogs/${newDataCatalog._id}`)
                .send({
                    name: 'Updated DataCatalog',
                    description: 'Updated description'
                })
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    updatedDataCatalog = res.body;
                    done();
                });
        });

        afterEach(function () {
            updatedDataCatalog = {};
        });

        it('should respond with the updated dataCatalog', function () {
            expect(updatedDataCatalog.name).to.equal('Updated DataCatalog');
            expect(updatedDataCatalog.description).to.equal('Updated description');
        });

        it('should respond with the updated dataCatalog on a subsequent GET', function (done) {
            request(app)
                .get(`/api/data-catalogs/${newDataCatalog._id}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    let dataCatalog = res.body;

                    expect(dataCatalog.name).to.equal('Updated DataCatalog');
                    expect(dataCatalog.description).to.equal('Updated description');

                    done();
                });
        });
    });

    describe('PATCH /api/data-catalogs/:id', function () {
        var patchedDataCatalog;

        beforeEach(function (done) {
            request(app)
                .patch(`/api/data-catalogs/${newDataCatalog._id}`)
                .send([{
                    op: 'replace',
                    path: '/name',
                    value: 'Patched DataCatalog'
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
                    patchedDataCatalog = res.body;
                    done();
                });
        });

        afterEach(function () {
            patchedDataCatalog = {};
        });

        it('should respond with the patched dataCatalog', function () {
            expect(patchedDataCatalog.name).to.equal('Patched DataCatalog');
            expect(patchedDataCatalog.description).to.equal('Patched description');
        });
    });

    describe('DELETE /api/data-catalogs/:id', function () {
        it('should respond with 204 on successful removal', function (done) {
            request(app)
                .delete(`/api/data-catalogs/${newDataCatalog._id}`)
                .expect(204)
                .end(err => {
                    if (err) {
                        return done(err);
                    }
                    done();
                });
        });

        it('should respond with 404 when dataCatalog does not exist', function (done) {
            request(app)
                .delete(`/api/data-catalogs/${newDataCatalog._id}`)
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
