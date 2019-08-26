/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';
import User from '../user/user.model';
import Organization from '../organization/organization.model';
import DataCatalog from './data-catalog.model';
import {
    adminUser,
    anotherUser,
    authOrganization,
    anotherOrganization,
    authenticateUser
} from '../integration-util';

var newDataCatalog;

describe('DataCatalog API:', function () {
    var token;

    before(() => {
        return DataCatalog.deleteMany()
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
        DataCatalog.deleteMany(),
        Organization.deleteMany(),
        User.deleteMany()
    ]));

    describe('GET /api/data-catalogs', function () {
        var dataCatalogs;

        beforeEach(function (done) {
            request(app)
                .get('/api/data-catalogs')
                .set('authorization', `Bearer ${token}`)
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
                .set('authorization', `Bearer ${token}`)
                .send({
                    slug: 'new-slug',
                    title: 'New title',
                    description: 'New description',
                    website: 'New website',
                    organization: authOrganization._id.toString(),
                    apiType: 'CKAN',
                    apiServerUrl: 'New apiServerUrl'
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
            expect(newDataCatalog.slug).to.equal('new-slug');
            expect(newDataCatalog.title).to.equal('New title');
            expect(newDataCatalog.description).to.equal('New description');
            expect(newDataCatalog.organization).to.equal(authOrganization._id.toString());
            expect(newDataCatalog.website).to.equal('New website');
            expect(newDataCatalog.apiType).to.equal('CKAN');
            expect(newDataCatalog.apiServerUrl).to.equal('New apiServerUrl');
            expect(newDataCatalog.createdBy).to.equal(adminUser._id.toString());
        });
    });

    describe('GET /api/data-catalogs/:id', function () {
        var dataCatalog;

        beforeEach(function (done) {
            request(app)
                .get(`/api/data-catalogs/${newDataCatalog._id}`)
                .set('authorization', `Bearer ${token}`)
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
            expect(dataCatalog.slug).to.equal('new-slug');
            expect(dataCatalog.title).to.equal('New title');
            expect(dataCatalog.description).to.equal('New description');
            expect(dataCatalog.organization._id).to.equal(authOrganization._id.toString());
            expect(dataCatalog.website).to.equal('New website');
            expect(dataCatalog.apiType).to.equal('CKAN');
            expect(dataCatalog.apiServerUrl).to.equal('New apiServerUrl');
            expect(dataCatalog.createdBy).to.equal(adminUser._id.toString());
        });
    });

    describe('PUT /api/data-catalogs/:id', function () {
        var updatedDataCatalog;

        beforeEach(function (done) {
            request(app)
                .put(`/api/data-catalogs/${newDataCatalog._id}`)
                .set('authorization', `Bearer ${token}`)
                .send({
                    slug: 'updated-slug',
                    title: 'Updated title',
                    description: 'Updated description',
                    organization: anotherOrganization._id.toString(),
                    website: 'Updated website',
                    apiType: 'CKAN',
                    apiServerUrl: 'Updated apiServerUrl'
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
            expect(updatedDataCatalog.slug).to.equal('updated-slug');
            expect(updatedDataCatalog.title).to.equal('Updated title');
            expect(updatedDataCatalog.description).to.equal('Updated description');
            expect(updatedDataCatalog.organization).to.equal(anotherOrganization._id.toString());
            expect(updatedDataCatalog.website).to.equal('Updated website');
            expect(updatedDataCatalog.apiType).to.equal('CKAN');
            expect(updatedDataCatalog.apiServerUrl).to.equal('Updated apiServerUrl');
            expect(updatedDataCatalog.createdBy).to.equal(adminUser._id.toString());
        });

        it('should respond with the updated dataCatalog on a subsequent GET', function (done) {
            request(app)
                .get(`/api/data-catalogs/${newDataCatalog._id}`)
                .set('authorization', `Bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    let dataCatalog = res.body;

                    expect(dataCatalog.slug).to.equal('updated-slug');
                    expect(dataCatalog.title).to.equal('Updated title');
                    expect(dataCatalog.description).to.equal('Updated description');
                    expect(dataCatalog.organization._id).to.equal(anotherOrganization._id.toString());
                    expect(dataCatalog.website).to.equal('Updated website');
                    expect(dataCatalog.apiType).to.equal('CKAN');
                    expect(dataCatalog.apiServerUrl).to.equal('Updated apiServerUrl');
                    expect(dataCatalog.createdBy).to.equal(adminUser._id.toString());

                    done();
                });
        });
    });

    describe('PATCH /api/data-catalogs/:id', function () {
        var patchedDataCatalog;

        beforeEach(function (done) {
            request(app)
                .patch(`/api/data-catalogs/${newDataCatalog._id}`)
                .set('authorization', `Bearer ${token}`)
                .send([{
                    op: 'replace',
                    path: '/slug',
                    value: 'patched-slug'
                }, {
                    op: 'replace',
                    path: '/title',
                    value: 'Patched title'
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
                    path: '/apiType',
                    value: 'CKAN'
                }, {
                    op: 'replace',
                    path: '/apiServerUrl',
                    value: 'Patched apiServerUrl'
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
            expect(patchedDataCatalog.slug).to.equal('patched-slug');
            expect(patchedDataCatalog.title).to.equal('Patched title');
            expect(patchedDataCatalog.description).to.equal('Patched description');
            expect(patchedDataCatalog.organization).to.equal(anotherOrganization._id.toString());
            expect(patchedDataCatalog.website).to.equal('Patched website');
            expect(patchedDataCatalog.apiType).to.equal('CKAN');
            expect(patchedDataCatalog.apiServerUrl).to.equal('Patched apiServerUrl');
            expect(patchedDataCatalog.createdBy).to.equal(adminUser._id.toString());
        });
    });

    describe('DELETE /api/data-catalogs/:id', function () {
        it('should respond with 204 on successful removal', function (done) {
            request(app)
                .delete(`/api/data-catalogs/${newDataCatalog._id}`)
                .set('authorization', `Bearer ${token}`)
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
