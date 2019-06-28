/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var permissionCtrlStub = {
  index: 'permissionCtrl.index',
  show: 'permissionCtrl.show',
  create: 'permissionCtrl.create',
  upsert: 'permissionCtrl.upsert',
  patch: 'permissionCtrl.patch',
  destroy: 'permissionCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var permissionIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './permission.controller': permissionCtrlStub
});

describe('Permission API Router:', function() {
  it('should return an express router instance', function() {
    expect(permissionIndex).to.equal(routerStub);
  });

  describe('GET /api/permissions', function() {
    it('should route to permission.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'permissionCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/permissions/:id', function() {
    it('should route to permission.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'permissionCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/permissions', function() {
    it('should route to permission.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'permissionCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/permissions/:id', function() {
    it('should route to permission.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'permissionCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/permissions/:id', function() {
    it('should route to permission.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'permissionCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/permissions/:id', function() {
    it('should route to permission.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'permissionCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
