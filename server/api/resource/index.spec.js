/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var resourceCtrlStub = {
  index: 'resourceCtrl.index',
  show: 'resourceCtrl.show',
  create: 'resourceCtrl.create',
  upsert: 'resourceCtrl.upsert',
  patch: 'resourceCtrl.patch',
  destroy: 'resourceCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var resourceIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './resource.controller': resourceCtrlStub
});

describe('Resource API Router:', function() {
  it('should return an express router instance', function() {
    expect(resourceIndex).to.equal(routerStub);
  });

  describe('GET /api/resources', function() {
    it('should route to resource.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'resourceCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/resources/:id', function() {
    it('should route to resource.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'resourceCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/resources', function() {
    it('should route to resource.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', sinon.match.func, 'resourceCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/resources/:id', function() {
    it('should route to resource.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'resourceCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/resources/:id', function() {
    it('should route to resource.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'resourceCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  // describe('DELETE /api/resources/:id', function() {
  //   it('should route to resource.controller.destroy', function() {
  //     expect(routerStub.delete
  //       .withArgs('/:id', 'resourceCtrl.destroy')
  //       ).to.have.been.calledOnce;
  //   });
  // });
});
