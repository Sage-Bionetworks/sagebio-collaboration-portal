/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newPermission;

describe('Permission API:', function() {
  describe('GET /api/permissions', function() {
    var permissions;

    beforeEach(function(done) {
      request(app)
        .get('/api/permissions')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          permissions = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(permissions).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/permissions', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/permissions')
        .send({
          name: 'New Permission',
          info: 'This is the brand new permission!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newPermission = res.body;
          done();
        });
    });

    it('should respond with the newly created permission', function() {
      expect(newPermission.name).to.equal('New Permission');
      expect(newPermission.info).to.equal('This is the brand new permission!!!');
    });
  });

  describe('GET /api/permissions/:id', function() {
    var permission;

    beforeEach(function(done) {
      request(app)
        .get(`/api/permissions/${newPermission._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          permission = res.body;
          done();
        });
    });

    afterEach(function() {
      permission = {};
    });

    it('should respond with the requested permission', function() {
      expect(permission.name).to.equal('New Permission');
      expect(permission.info).to.equal('This is the brand new permission!!!');
    });
  });

  describe('PUT /api/permissions/:id', function() {
    var updatedPermission;

    beforeEach(function(done) {
      request(app)
        .put(`/api/permissions/${newPermission._id}`)
        .send({
          name: 'Updated Permission',
          info: 'This is the updated permission!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedPermission = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPermission = {};
    });

    it('should respond with the updated permission', function() {
      expect(updatedPermission.name).to.equal('Updated Permission');
      expect(updatedPermission.info).to.equal('This is the updated permission!!!');
    });

    it('should respond with the updated permission on a subsequent GET', function(done) {
      request(app)
        .get(`/api/permissions/${newPermission._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let permission = res.body;

          expect(permission.name).to.equal('Updated Permission');
          expect(permission.info).to.equal('This is the updated permission!!!');

          done();
        });
    });
  });

  describe('PATCH /api/permissions/:id', function() {
    var patchedPermission;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/permissions/${newPermission._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Permission' },
          { op: 'replace', path: '/info', value: 'This is the patched permission!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedPermission = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedPermission = {};
    });

    it('should respond with the patched permission', function() {
      expect(patchedPermission.name).to.equal('Patched Permission');
      expect(patchedPermission.info).to.equal('This is the patched permission!!!');
    });
  });

  describe('DELETE /api/permissions/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/permissions/${newPermission._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when permission does not exist', function(done) {
      request(app)
        .delete(`/api/permissions/${newPermission._id}`)
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
