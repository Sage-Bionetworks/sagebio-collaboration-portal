/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newStarredMessage;

describe('StarredMessage API:', function() {
  describe('GET /api/starred-messages', function() {
    var starredMessages;

    beforeEach(function(done) {
      request(app)
        .get('/api/starred-messages')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          starredMessages = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(starredMessages).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/starred-messages', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/starred-messages')
        .send({
          name: 'New StarredMessage',
          info: 'This is the brand new starredMessage!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newStarredMessage = res.body;
          done();
        });
    });

    it('should respond with the newly created starredMessage', function() {
      expect(newStarredMessage.name).to.equal('New StarredMessage');
      expect(newStarredMessage.info).to.equal('This is the brand new starredMessage!!!');
    });
  });

  describe('GET /api/starred-messages/:id', function() {
    var starredMessage;

    beforeEach(function(done) {
      request(app)
        .get(`/api/starred-messages/${newStarredMessage._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          starredMessage = res.body;
          done();
        });
    });

    afterEach(function() {
      starredMessage = {};
    });

    it('should respond with the requested starredMessage', function() {
      expect(starredMessage.name).to.equal('New StarredMessage');
      expect(starredMessage.info).to.equal('This is the brand new starredMessage!!!');
    });
  });

  describe('PUT /api/starred-messages/:id', function() {
    var updatedStarredMessage;

    beforeEach(function(done) {
      request(app)
        .put(`/api/starred-messages/${newStarredMessage._id}`)
        .send({
          name: 'Updated StarredMessage',
          info: 'This is the updated starredMessage!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedStarredMessage = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedStarredMessage = {};
    });

    it('should respond with the updated starredMessage', function() {
      expect(updatedStarredMessage.name).to.equal('Updated StarredMessage');
      expect(updatedStarredMessage.info).to.equal('This is the updated starredMessage!!!');
    });

    it('should respond with the updated starredMessage on a subsequent GET', function(done) {
      request(app)
        .get(`/api/starred-messages/${newStarredMessage._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let starredMessage = res.body;

          expect(starredMessage.name).to.equal('Updated StarredMessage');
          expect(starredMessage.info).to.equal('This is the updated starredMessage!!!');

          done();
        });
    });
  });

  describe('PATCH /api/starred-messages/:id', function() {
    var patchedStarredMessage;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/starred-messages/${newStarredMessage._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched StarredMessage' },
          { op: 'replace', path: '/info', value: 'This is the patched starredMessage!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedStarredMessage = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedStarredMessage = {};
    });

    it('should respond with the patched starredMessage', function() {
      expect(patchedStarredMessage.name).to.equal('Patched StarredMessage');
      expect(patchedStarredMessage.info).to.equal('This is the patched starredMessage!!!');
    });
  });

  describe('DELETE /api/starred-messages/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/starred-messages/${newStarredMessage._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when starredMessage does not exist', function(done) {
      request(app)
        .delete(`/api/starred-messages/${newStarredMessage._id}`)
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
