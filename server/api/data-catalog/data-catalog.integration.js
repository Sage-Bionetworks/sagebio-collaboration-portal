/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';
import mongoose from 'mongoose';
import User from '../user/user.model';
import Organization from '../organization/organization.model';

var newDataCatalog;

describe('DataCatalog API:', function () {
    var user;
    var anotherUser;
    var organization;
    var anotherOrganization;

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
        .then(() =>
            Organization.deleteMany()
            .then(() => {
                organization = new Organization({
                    name: 'Fake Organization',
                    website: 'Fake website',
                    createdBy: user
                });

                anotherOrganization = new Organization({
                    name: 'Another Fake Organization',
                    website: 'Fake website',
                    createdBy: anotherUser
                });

                return Promise.all([
                    organization.save(),
                    anotherOrganization.save()
                ]);
            })
        ));

    // Clear users after testing
    after(() => Promise.all([
        User.deleteMany(),
        Organization.deleteMany()
    ]));

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
                    name: 'New name',
                    description: 'New description',
                    website: 'New website',
                    organization: organization._id.toString(),
                    apiType: 'CKAN',
                    apiServerUrl: 'New apiServerUrl',
                    createdBy: user._id.toString()
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
            expect(newDataCatalog.name).to.equal('New name');
            expect(newDataCatalog.description).to.equal('New description');
            expect(newDataCatalog.website).to.equal('New website');
            expect(newDataCatalog.organization).to.equal(organization._id.toString());
            expect(newDataCatalog.apiType).to.equal('CKAN');
            expect(newDataCatalog.apiServerUrl).to.equal('New apiServerUrl');
            expect(newDataCatalog.createdBy).to.equal(user._id.toString());
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
            expect(dataCatalog.name).to.equal('New name');
            expect(dataCatalog.description).to.equal('New description');
            expect(dataCatalog.website).to.equal('New website');
            expect(dataCatalog.organization._id).to.equal(organization._id.toString());
            expect(dataCatalog.apiType).to.equal('CKAN');
            expect(dataCatalog.apiServerUrl).to.equal('New apiServerUrl');
            expect(dataCatalog.createdBy).to.equal(user._id.toString());
        });
    });

    describe('PUT /api/data-catalogs/:id', function () {
        var updatedDataCatalog;

        beforeEach(function (done) {
            request(app)
                .put(`/api/data-catalogs/${newDataCatalog._id}`)
                .send({
                    name: 'Updated name',
                    description: 'Updated description',
                    website: 'Updated website',
                    organization: anotherOrganization._id.toString(),
                    apiType: 'CKAN',
                    apiServerUrl: 'Updated apiServerUrl',
                    createdBy: anotherUser._id.toString()
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
            expect(updatedDataCatalog.name).to.equal('Updated name');
            expect(updatedDataCatalog.description).to.equal('Updated description');
            expect(updatedDataCatalog.website).to.equal('Updated website');
            expect(updatedDataCatalog.organization).to.equal(anotherOrganization._id.toString());
            expect(updatedDataCatalog.apiType).to.equal('CKAN');
            expect(updatedDataCatalog.apiServerUrl).to.equal('Updated apiServerUrl');
            expect(updatedDataCatalog.createdBy).to.equal(anotherUser._id.toString());
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

                    expect(dataCatalog.name).to.equal('Updated name');
                    expect(dataCatalog.description).to.equal('Updated description');
                    expect(dataCatalog.website).to.equal('Updated website');
                    expect(dataCatalog.organization._id).to.equal(anotherOrganization._id.toString());
                    expect(dataCatalog.apiType).to.equal('CKAN');
                    expect(dataCatalog.apiServerUrl).to.equal('Updated apiServerUrl');
                    expect(dataCatalog.createdBy).to.equal(anotherUser._id.toString());

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
                    value: 'Patched name'
                }, {
                    op: 'replace',
                    path: '/description',
                    value: 'Patched description'
                }, {
                    op: 'replace',
                    path: '/website',
                    value: 'Patched website'
                }, {
                    op: 'replace',
                    path: '/organization',
                    value: anotherOrganization._id.toString()
                }, {
                    op: 'replace',
                    path: '/apiType',
                    value: 'CKAN'
                }, {
                    op: 'replace',
                    path: '/apiServerUrl',
                    value: 'Patched apiServerUrl'
                }, {
                    op: 'replace',
                    path: '/createdBy',
                    value: anotherUser._id.toString()
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
            expect(patchedDataCatalog.name).to.equal('Patched name');
            expect(patchedDataCatalog.description).to.equal('Patched description');
            expect(patchedDataCatalog.website).to.equal('Patched website');
            expect(patchedDataCatalog.organization).to.equal(anotherOrganization._id.toString());
            expect(patchedDataCatalog.apiType).to.equal('CKAN');
            expect(patchedDataCatalog.apiServerUrl).to.equal('Patched apiServerUrl');
            expect(patchedDataCatalog.createdBy).to.equal(anotherUser._id.toString());
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
