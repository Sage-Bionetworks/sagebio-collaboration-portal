/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newInsight;

describe('Insight API:', function() {
  describe('GET /api/insights', function() {
    var insights;

    beforeEach(function(done) {
      request(app)
        .get('/api/insights')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          insights = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(insights).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/insights', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/insights')
        .send({
          name: 'New Insight',
          info: 'This is the brand new insight!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newInsight = res.body;
          done();
        });
    });

    it('should respond with the newly created insight', function() {
      expect(newInsight.name).to.equal('New Insight');
      expect(newInsight.info).to.equal('This is the brand new insight!!!');
    });
  });

  describe('GET /api/insights/:id', function() {
    var insight;

    beforeEach(function(done) {
      request(app)
        .get(`/api/insights/${newInsight._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          insight = res.body;
          done();
        });
    });

    afterEach(function() {
      insight = {};
    });

    it('should respond with the requested insight', function() {
      expect(insight.name).to.equal('New Insight');
      expect(insight.info).to.equal('This is the brand new insight!!!');
    });
  });

  describe('PUT /api/insights/:id', function() {
    var updatedInsight;

    beforeEach(function(done) {
      request(app)
        .put(`/api/insights/${newInsight._id}`)
        .send({
          name: 'Updated Insight',
          info: 'This is the updated insight!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedInsight = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedInsight = {};
    });

    it('should respond with the updated insight', function() {
      expect(updatedInsight.name).to.equal('Updated Insight');
      expect(updatedInsight.info).to.equal('This is the updated insight!!!');
    });

    it('should respond with the updated insight on a subsequent GET', function(done) {
      request(app)
        .get(`/api/insights/${newInsight._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let insight = res.body;

          expect(insight.name).to.equal('Updated Insight');
          expect(insight.info).to.equal('This is the updated insight!!!');

          done();
        });
    });
  });

  describe('PATCH /api/insights/:id', function() {
    var patchedInsight;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/insights/${newInsight._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Insight' },
          { op: 'replace', path: '/info', value: 'This is the patched insight!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedInsight = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedInsight = {};
    });

    it('should respond with the patched insight', function() {
      expect(patchedInsight.name).to.equal('Patched Insight');
      expect(patchedInsight.info).to.equal('This is the patched insight!!!');
    });
  });

  describe('DELETE /api/insights/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/insights/${newInsight._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when insight does not exist', function(done) {
      request(app)
        .delete(`/api/insights/${newInsight._id}`)
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
