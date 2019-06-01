/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var starredMessageCtrlStub = {
  index: 'starredMessageCtrl.index',
  show: 'starredMessageCtrl.show',
  create: 'starredMessageCtrl.create',
  upsert: 'starredMessageCtrl.upsert',
  patch: 'starredMessageCtrl.patch',
  destroy: 'starredMessageCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var starredMessageIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './starred-message.controller': starredMessageCtrlStub
});

describe('StarredMessage API Router:', function() {
  it('should return an express router instance', function() {
    expect(starredMessageIndex).to.equal(routerStub);
  });

  describe('GET /api/starred-messages', function() {
    it('should route to starredMessage.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'starredMessageCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/starred-messages/:id', function() {
    it('should route to starredMessage.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'starredMessageCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/starred-messages', function() {
    it('should route to starredMessage.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'starredMessageCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/starred-messages/:id', function() {
    it('should route to starredMessage.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'starredMessageCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/starred-messages/:id', function() {
    it('should route to starredMessage.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'starredMessageCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/starred-messages/:id', function() {
    it('should route to starredMessage.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'starredMessageCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
