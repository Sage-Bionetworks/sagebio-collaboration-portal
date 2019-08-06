/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var insightCtrlStub = {
  index: 'insightCtrl.index',
  show: 'insightCtrl.show',
  create: 'insightCtrl.create',
  upsert: 'insightCtrl.upsert',
  patch: 'insightCtrl.patch',
  destroy: 'insightCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var insightIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './insight.controller': insightCtrlStub
});

describe('Insight API Router:', function() {
  it('should return an express router instance', function() {
    expect(insightIndex).to.equal(routerStub);
  });

  describe('GET /api/insights', function() {
    it('should route to insight.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', sinon.match.func, 'insightCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/insights/:id', function() {
    it('should route to insight.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', sinon.match.func, 'insightCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/insights', function() {
    it('should route to insight.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', sinon.match.func, 'insightCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/insights/:id', function() {
    it('should route to insight.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'insightCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/insights/:id', function() {
    it('should route to insight.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'insightCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  // describe('DELETE /api/insights/:id', function() {
  //   it('should route to insight.controller.destroy', function() {
  //     expect(routerStub.delete
  //       .withArgs('/:id', 'insightCtrl.destroy')
  //       ).to.have.been.calledOnce;
  //   });
  // });
});
