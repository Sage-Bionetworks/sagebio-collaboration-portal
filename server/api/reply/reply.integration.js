/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newReply;

describe('Reply API:', function() {
  describe('GET /api/replies', function() {
    var replys;

    beforeEach(function(done) {
      request(app)
        .get('/api/replies')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          replys = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(replys).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/replies', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/replies')
        .send({
          name: 'New Reply',
          info: 'This is the brand new reply!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newReply = res.body;
          done();
        });
    });

    it('should respond with the newly created reply', function() {
      expect(newReply.name).to.equal('New Reply');
      expect(newReply.info).to.equal('This is the brand new reply!!!');
    });
  });

  describe('GET /api/replies/:id', function() {
    var reply;

    beforeEach(function(done) {
      request(app)
        .get(`/api/replies/${newReply._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          reply = res.body;
          done();
        });
    });

    afterEach(function() {
      reply = {};
    });

    it('should respond with the requested reply', function() {
      expect(reply.name).to.equal('New Reply');
      expect(reply.info).to.equal('This is the brand new reply!!!');
    });
  });

  describe('PUT /api/replies/:id', function() {
    var updatedReply;

    beforeEach(function(done) {
      request(app)
        .put(`/api/replies/${newReply._id}`)
        .send({
          name: 'Updated Reply',
          info: 'This is the updated reply!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedReply = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedReply = {};
    });

    it('should respond with the updated reply', function() {
      expect(updatedReply.name).to.equal('Updated Reply');
      expect(updatedReply.info).to.equal('This is the updated reply!!!');
    });

    it('should respond with the updated reply on a subsequent GET', function(done) {
      request(app)
        .get(`/api/replies/${newReply._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let reply = res.body;

          expect(reply.name).to.equal('Updated Reply');
          expect(reply.info).to.equal('This is the updated reply!!!');

          done();
        });
    });
  });

  describe('PATCH /api/replies/:id', function() {
    var patchedReply;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/replies/${newReply._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Reply' },
          { op: 'replace', path: '/info', value: 'This is the patched reply!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedReply = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedReply = {};
    });

    it('should respond with the patched reply', function() {
      expect(patchedReply.name).to.equal('Patched Reply');
      expect(patchedReply.info).to.equal('This is the patched reply!!!');
    });
  });

  describe('DELETE /api/replies/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/replies/${newReply._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when reply does not exist', function(done) {
      request(app)
        .delete(`/api/replies/${newReply._id}`)
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
