/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newDataCatalog;

describe('DataCatalog API:', function() {
  describe('GET /api/data-catalogs', function() {
    var dataCatalogs;

    beforeEach(function(done) {
      request(app)
        .get('/api/data-catalogs')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          dataCatalogs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(dataCatalogs).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/data-catalogs', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/data-catalogs')
        .send({
          name: 'New DataCatalog',
          info: 'This is the brand new dataCatalog!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newDataCatalog = res.body;
          done();
        });
    });

    it('should respond with the newly created dataCatalog', function() {
      expect(newDataCatalog.name).to.equal('New DataCatalog');
      expect(newDataCatalog.info).to.equal('This is the brand new dataCatalog!!!');
    });
  });

  describe('GET /api/data-catalogs/:id', function() {
    var dataCatalog;

    beforeEach(function(done) {
      request(app)
        .get(`/api/data-catalogs/${newDataCatalog._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          dataCatalog = res.body;
          done();
        });
    });

    afterEach(function() {
      dataCatalog = {};
    });

    it('should respond with the requested dataCatalog', function() {
      expect(dataCatalog.name).to.equal('New DataCatalog');
      expect(dataCatalog.info).to.equal('This is the brand new dataCatalog!!!');
    });
  });

  describe('PUT /api/data-catalogs/:id', function() {
    var updatedDataCatalog;

    beforeEach(function(done) {
      request(app)
        .put(`/api/data-catalogs/${newDataCatalog._id}`)
        .send({
          name: 'Updated DataCatalog',
          info: 'This is the updated dataCatalog!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedDataCatalog = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedDataCatalog = {};
    });

    it('should respond with the updated dataCatalog', function() {
      expect(updatedDataCatalog.name).to.equal('Updated DataCatalog');
      expect(updatedDataCatalog.info).to.equal('This is the updated dataCatalog!!!');
    });

    it('should respond with the updated dataCatalog on a subsequent GET', function(done) {
      request(app)
        .get(`/api/data-catalogs/${newDataCatalog._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let dataCatalog = res.body;

          expect(dataCatalog.name).to.equal('Updated DataCatalog');
          expect(dataCatalog.info).to.equal('This is the updated dataCatalog!!!');

          done();
        });
    });
  });

  describe('PATCH /api/data-catalogs/:id', function() {
    var patchedDataCatalog;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/data-catalogs/${newDataCatalog._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched DataCatalog' },
          { op: 'replace', path: '/info', value: 'This is the patched dataCatalog!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedDataCatalog = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedDataCatalog = {};
    });

    it('should respond with the patched dataCatalog', function() {
      expect(patchedDataCatalog.name).to.equal('Patched DataCatalog');
      expect(patchedDataCatalog.info).to.equal('This is the patched dataCatalog!!!');
    });
  });

  describe('DELETE /api/data-catalogs/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/data-catalogs/${newDataCatalog._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when dataCatalog does not exist', function(done) {
      request(app)
        .delete(`/api/data-catalogs/${newDataCatalog._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
