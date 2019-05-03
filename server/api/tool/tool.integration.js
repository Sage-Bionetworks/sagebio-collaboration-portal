  /* globals describe, expect, it, beforeEach, afterEach */

  var app = require('../..');
  import request from 'supertest';
  import mongoose from 'mongoose';
  import User from '../user/user.model';
  import Organization from '../organization/organization.model';

  var newTool;

  describe('Tool API:', function () {
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

      describe('GET /api/tools', function () {
          var tools;

          beforeEach(function (done) {
              request(app)
                  .get('/api/tools')
                  .expect(200)
                  .expect('Content-Type', /json/)
                  .end((err, res) => {
                      if (err) {
                          return done(err);
                      }
                      tools = res.body;
                      done();
                  });
          });

          it('should respond with JSON array', function () {
              expect(tools).to.be.instanceOf(Array);
          });
      });

      describe('POST /api/tools', function () {
          beforeEach(function (done) {
              request(app)
                  .post('/api/tools')
                  .send({
                      name: 'New name',
                      description: 'New description',
                      website: 'New website',
                      organization: organization._id.toString(),
                      apiServerUrl: 'New apiServerUrl',
                      createdBy: user._id.toString()
                  })
                  .expect(201)
                  .expect('Content-Type', /json/)
                  .end((err, res) => {
                      if (err) {
                          return done(err);
                      }
                      newTool = res.body;
                      done();
                  });
          });

          it('should respond with the newly created tool', function () {
              expect(newTool.name).to.equal('New name');
              expect(newTool.description).to.equal('New description');
              expect(newTool.website).to.equal('New website');
              expect(newTool.organization).to.equal(organization._id.toString());
              expect(newTool.apiServerUrl).to.equal('New apiServerUrl');
              expect(newTool.createdBy).to.equal(user._id.toString());
          });
      });

      describe('GET /api/tools/:id', function () {
          var tool;

          beforeEach(function (done) {
              request(app)
                  .get(`/api/tools/${newTool._id}`)
                  .expect(200)
                  .expect('Content-Type', /json/)
                  .end((err, res) => {
                      if (err) {
                          return done(err);
                      }
                      tool = res.body;
                      done();
                  });
          });

          afterEach(function () {
              tool = {};
          });

          it('should respond with the requested tool', function () {
              expect(tool.name).to.equal('New name');
              expect(tool.description).to.equal('New description');
              expect(tool.website).to.equal('New website');
              expect(tool.organization._id).to.equal(organization._id.toString());
              expect(tool.apiServerUrl).to.equal('New apiServerUrl');
              expect(tool.createdBy).to.equal(user._id.toString());
          });
      });

      describe('PUT /api/tools/:id', function () {
          var updatedTool;

          beforeEach(function (done) {
              request(app)
                  .put(`/api/tools/${newTool._id}`)
                  .send({
                      name: 'Updated name',
                      description: 'Updated description',
                      website: 'Updated website',
                      organization: anotherOrganization._id.toString(),
                      apiServerUrl: 'Updated apiServerUrl',
                      createdBy: anotherUser._id.toString()
                  })
                  .expect(200)
                  .expect('Content-Type', /json/)
                  .end(function (err, res) {
                      if (err) {
                          return done(err);
                      }
                      updatedTool = res.body;
                      done();
                  });
          });

          afterEach(function () {
              updatedTool = {};
          });

          it('should respond with the updated tool', function () {
              expect(updatedTool.name).to.equal('Updated name');
              expect(updatedTool.description).to.equal('Updated description');
              expect(updatedTool.website).to.equal('Updated website');
              expect(updatedTool.organization).to.equal(anotherOrganization._id.toString());
              expect(updatedTool.apiServerUrl).to.equal('Updated apiServerUrl');
              expect(updatedTool.createdBy).to.equal(anotherUser._id.toString());
          });

          it('should respond with the updated tool on a subsequent GET', function (done) {
              request(app)
                  .get(`/api/tools/${newTool._id}`)
                  .expect(200)
                  .expect('Content-Type', /json/)
                  .end((err, res) => {
                      if (err) {
                          return done(err);
                      }
                      let tool = res.body;

                      expect(tool.name).to.equal('Updated name');
                      expect(tool.description).to.equal('Updated description');
                      expect(tool.website).to.equal('Updated website');
                      expect(tool.organization._id).to.equal(anotherOrganization._id.toString());
                      expect(tool.apiServerUrl).to.equal('Updated apiServerUrl');
                      expect(tool.createdBy).to.equal(anotherUser._id.toString());

                      done();
                  });
          });
      });

      describe('PATCH /api/tools/:id', function () {
          var patchedTool;

          beforeEach(function (done) {
              request(app)
                  .patch(`/api/tools/${newTool._id}`)
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
                      patchedTool = res.body;
                      done();
                  });
          });

          afterEach(function () {
              patchedTool = {};
          });

          it('should respond with the patched tool', function () {
              expect(patchedTool.name).to.equal('Patched name');
              expect(patchedTool.description).to.equal('Patched description');
              expect(patchedTool.website).to.equal('Patched website');
              expect(patchedTool.organization).to.equal(anotherOrganization._id.toString());
              expect(patchedTool.apiServerUrl).to.equal('Patched apiServerUrl');
              expect(patchedTool.createdBy).to.equal(anotherUser._id.toString());
          });
      });

      describe('DELETE /api/tools/:id', function () {
          it('should respond with 204 on successful removal', function (done) {
              request(app)
                  .delete(`/api/tools/${newTool._id}`)
                  .expect(204)
                  .end(err => {
                      if (err) {
                          return done(err);
                      }
                      done();
                  });
          });

          it('should respond with 404 when tool does not exist', function (done) {
              request(app)
                  .delete(`/api/tools/${newTool._id}`)
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
