/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newOrganization;

describe('Organization API:', function() {
  describe('GET /api/organizations', function() {
    var organizations;

    beforeEach(function(done) {
      request(app)
        .get('/api/organizations')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          organizations = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(organizations).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/organizations', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/organizations')
        .send({
          name: 'New Organization'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newOrganization = res.body;
          done();
        });
    });

    it('should respond with the newly created organization', function() {
      expect(newOrganization.name).to.equal('New Organization');
    });
  });

  describe('GET /api/organizations/:id', function() {
    var organization;

    beforeEach(function(done) {
      request(app)
        .get(`/api/organizations/${newOrganization._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          organization = res.body;
          done();
        });
    });

    afterEach(function() {
      organization = {};
    });

    it('should respond with the requested organization', function() {
      expect(organization.name).to.equal('New Organization');
    });
  });

  describe('PUT /api/organizations/:id', function() {
    var updatedOrganization;

    beforeEach(function(done) {
      request(app)
        .put(`/api/organizations/${newOrganization._id}`)
        .send({
          name: 'Updated Organization',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedOrganization = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedOrganization = {};
    });

    it('should respond with the updated organization', function() {
      expect(updatedOrganization.name).to.equal('Updated Organization');
    });

    it('should respond with the updated organization on a subsequent GET', function(done) {
      request(app)
        .get(`/api/organizations/${newOrganization._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let organization = res.body;

          expect(organization.name).to.equal('Updated Organization');

          done();
        });
    });
  });

  describe('PATCH /api/organizations/:id', function() {
    var patchedOrganization;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/organizations/${newOrganization._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Organization' },
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedOrganization = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedOrganization = {};
    });

    it('should respond with the patched organization', function() {
      expect(patchedOrganization.name).to.equal('Patched Organization');
    });
  });

  describe('DELETE /api/organizations/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/organizations/${newOrganization._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when organization does not exist', function(done) {
      request(app)
        .delete(`/api/organizations/${newOrganization._id}`)
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
