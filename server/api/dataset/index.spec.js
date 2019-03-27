/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var datasetCtrlStub = {
  index: 'datasetCtrl.index',
  show: 'datasetCtrl.show',
  create: 'datasetCtrl.create',
  upsert: 'datasetCtrl.upsert',
  patch: 'datasetCtrl.patch',
  destroy: 'datasetCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var datasetIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './dataset.controller': datasetCtrlStub
});

describe('Dataset API Router:', function() {
  it('should return an express router instance', function() {
    expect(datasetIndex).to.equal(routerStub);
  });

  describe('GET /api/datasets', function() {
    it('should route to dataset.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'datasetCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/datasets/:id', function() {
    it('should route to dataset.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'datasetCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/datasets', function() {
    it('should route to dataset.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'datasetCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/datasets/:id', function() {
    it('should route to dataset.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'datasetCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/datasets/:id', function() {
    it('should route to dataset.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'datasetCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/datasets/:id', function() {
    it('should route to dataset.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'datasetCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
