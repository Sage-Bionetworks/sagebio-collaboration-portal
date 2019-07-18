/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var provenanceCtrlStub = {
  index: 'provenanceCtrl.index',
  show: 'provenanceCtrl.show',
  create: 'provenanceCtrl.create',
  upsert: 'provenanceCtrl.upsert',
  patch: 'provenanceCtrl.patch',
  destroy: 'provenanceCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var provenanceIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './provenance.controller': provenanceCtrlStub
});

describe('Provenance API Router:', function() {
  it('should return an express router instance', function() {
    expect(provenanceIndex).to.equal(routerStub);
  });

  describe('GET /api/provenance', function() {
    it('should route to provenance.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'provenanceCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/provenance/:id', function() {
    it('should route to provenance.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'provenanceCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/provenance', function() {
    it('should route to provenance.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'provenanceCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/provenance/:id', function() {
    it('should route to provenance.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'provenanceCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/provenance/:id', function() {
    it('should route to provenance.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'provenanceCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/provenance/:id', function() {
    it('should route to provenance.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'provenanceCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
