/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var organizationCtrlStub = {
  index: 'organizationCtrl.index',
  show: 'organizationCtrl.show',
  create: 'organizationCtrl.create',
  upsert: 'organizationCtrl.upsert',
  patch: 'organizationCtrl.patch',
  destroy: 'organizationCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var organizationIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './organization.controller': organizationCtrlStub
});

describe('Organization API Router:', function() {
  it('should return an express router instance', function() {
    expect(organizationIndex).to.equal(routerStub);
  });

  describe('GET /api/organizations', function() {
    it('should route to organization.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'organizationCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/organizations/:id', function() {
    it('should route to organization.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'organizationCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/organizations', function() {
    it('should route to organization.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'organizationCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/organizations/:id', function() {
    it('should route to organization.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'organizationCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/organizations/:id', function() {
    it('should route to organization.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'organizationCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/organizations/:id', function() {
    it('should route to organization.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'organizationCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
