/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newDataset;

describe('Dataset API:', function() {
  describe('GET /api/datasets', function() {
    var datasets;

    beforeEach(function(done) {
      request(app)
        .get('/api/datasets')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          datasets = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(datasets).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/datasets', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/datasets')
        .send({
          name: 'New Dataset',
          info: 'This is the brand new dataset!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newDataset = res.body;
          done();
        });
    });

    it('should respond with the newly created dataset', function() {
      expect(newDataset.name).to.equal('New Dataset');
      expect(newDataset.info).to.equal('This is the brand new dataset!!!');
    });
  });

  describe('GET /api/datasets/:id', function() {
    var dataset;

    beforeEach(function(done) {
      request(app)
        .get(`/api/datasets/${newDataset._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          dataset = res.body;
          done();
        });
    });

    afterEach(function() {
      dataset = {};
    });

    it('should respond with the requested dataset', function() {
      expect(dataset.name).to.equal('New Dataset');
      expect(dataset.info).to.equal('This is the brand new dataset!!!');
    });
  });

  describe('PUT /api/datasets/:id', function() {
    var updatedDataset;

    beforeEach(function(done) {
      request(app)
        .put(`/api/datasets/${newDataset._id}`)
        .send({
          name: 'Updated Dataset',
          info: 'This is the updated dataset!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedDataset = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedDataset = {};
    });

    it('should respond with the updated dataset', function() {
      expect(updatedDataset.name).to.equal('Updated Dataset');
      expect(updatedDataset.info).to.equal('This is the updated dataset!!!');
    });

    it('should respond with the updated dataset on a subsequent GET', function(done) {
      request(app)
        .get(`/api/datasets/${newDataset._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let dataset = res.body;

          expect(dataset.name).to.equal('Updated Dataset');
          expect(dataset.info).to.equal('This is the updated dataset!!!');

          done();
        });
    });
  });

  describe('PATCH /api/datasets/:id', function() {
    var patchedDataset;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/datasets/${newDataset._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Dataset' },
          { op: 'replace', path: '/info', value: 'This is the patched dataset!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedDataset = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedDataset = {};
    });

    it('should respond with the patched dataset', function() {
      expect(patchedDataset.name).to.equal('Patched Dataset');
      expect(patchedDataset.info).to.equal('This is the patched dataset!!!');
    });
  });

  describe('DELETE /api/datasets/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/datasets/${newDataset._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when dataset does not exist', function(done) {
      request(app)
        .delete(`/api/datasets/${newDataset._id}`)
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
