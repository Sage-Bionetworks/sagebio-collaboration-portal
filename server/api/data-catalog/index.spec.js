/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var dataCatalogCtrlStub = {
  index: 'dataCatalogCtrl.index',
  show: 'dataCatalogCtrl.show',
  create: 'dataCatalogCtrl.create',
  upsert: 'dataCatalogCtrl.upsert',
  patch: 'dataCatalogCtrl.patch',
  destroy: 'dataCatalogCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var dataCatalogIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './data-catalog.controller': dataCatalogCtrlStub
});

describe('DataCatalog API Router:', function() {
  it('should return an express router instance', function() {
    expect(dataCatalogIndex).to.equal(routerStub);
  });

  describe('GET /api/data-catalogs', function() {
    it('should route to dataCatalog.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'dataCatalogCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/data-catalogs/:id', function() {
    it('should route to dataCatalog.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'dataCatalogCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/data-catalogs', function() {
    it('should route to dataCatalog.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'dataCatalogCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/data-catalogs/:id', function() {
    it('should route to dataCatalog.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'dataCatalogCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/data-catalogs/:id', function() {
    it('should route to dataCatalog.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'dataCatalogCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/data-catalogs/:id', function() {
    it('should route to dataCatalog.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'dataCatalogCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
