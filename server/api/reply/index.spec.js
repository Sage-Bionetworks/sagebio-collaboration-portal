/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var replyCtrlStub = {
  index: 'replyCtrl.index',
  show: 'replyCtrl.show',
  create: 'replyCtrl.create',
  upsert: 'replyCtrl.upsert',
  patch: 'replyCtrl.patch',
  destroy: 'replyCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var replyIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './reply.controller': replyCtrlStub
});

describe('Reply API Router:', function() {
  it('should return an express router instance', function() {
    expect(replyIndex).to.equal(routerStub);
  });

  describe('GET /api/replies', function() {
    it('should route to reply.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'replyCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/replies/:id', function() {
    it('should route to reply.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'replyCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/replies', function() {
    it('should route to reply.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'replyCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/replies/:id', function() {
    it('should route to reply.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'replyCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/replies/:id', function() {
    it('should route to reply.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'replyCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/replies/:id', function() {
    it('should route to reply.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'replyCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
