/* globals describe, expect, it, before, beforeEach, after, afterEach */

var app = require('../..');
import request from 'supertest';
import User from '../user/user.model';
import Organization from '../organization/organization.model';
import DataCatalog from './data-catalog.model';
import { adminUser, anotherUser, authOrganization, anotherOrganization, authenticateUser } from '../integration-util';

var newDataCatalog;

describe('DataCatalog API:', function () {
    var token;

    before(() => DataCatalog.deleteMany()
        .then(() => Organization.deleteMany())
        .then(() => User.deleteMany())
        .then(() => User.create([adminUser, anotherUser]))
        .then(() => Organization.create([authOrganization, anotherOrganization]))
        .then(authenticateUser(app, adminUser))
        .then(res => {
            token = res;
        }));

    after(() => Promise.all([DataCatalog.deleteMany(), Organization.deleteMany(), User.deleteMany()]));

    describe('GET /api/data-catalogs', function () {
        var response;

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

    describe('POST /api/data-catalogs', function () {
        beforeEach(function (done) {
            request(app)
                .post('/api/data-catalogs')
                .set('authorization', `Bearer ${token}`)
                .send({
                    title: 'New title',
                    description: 'New description',
                    website: 'New website',
                    organization: authOrganization._id.toString(),
                    apiType: 'CKAN',
                    apiServerUrl: 'New apiServerUrl',
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
            expect(dataCatalog.title).to.equal('New title');
            expect(dataCatalog.description).to.equal('New description');
            expect(dataCatalog.organization._id).to.equal(authOrganization._id.toString());
            expect(dataCatalog.website).to.equal('New website');
            expect(dataCatalog.apiType).to.equal('CKAN');
            expect(dataCatalog.apiServerUrl).to.equal('New apiServerUrl');
            expect(dataCatalog.createdBy).to.equal(adminUser._id.toString());
        });
    });

    describe('PATCH /api/data-catalogs/:id', function () {
        var patchedDataCatalog;

        beforeEach(function (done) {
            request(app)
                .patch(`/api/data-catalogs/${newDataCatalog._id}`)
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
                        path: '/organization',
                        value: anotherOrganization._id.toString(),
                    },
                    {
                        op: 'replace',
                        path: '/website',
                        value: 'Patched website',
                    },
                    {
                        op: 'replace',
                        path: '/apiType',
                        value: 'CKAN',
                    },
                    {
                        op: 'replace',
                        path: '/apiServerUrl',
                        value: 'Patched apiServerUrl',
                    },
                ])
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
