/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var toolCtrlStub = {
  index: 'toolCtrl.index',
  show: 'toolCtrl.show',
  create: 'toolCtrl.create',
  upsert: 'toolCtrl.upsert',
  patch: 'toolCtrl.patch',
  destroy: 'toolCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var toolIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './tool.controller': toolCtrlStub
});

describe('Tool API Router:', function() {
  it('should return an express router instance', function() {
    expect(toolIndex).to.equal(routerStub);
  });

  describe('GET /api/tools', function() {
    it('should route to tool.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'toolCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/tools/:id', function() {
    it('should route to tool.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'toolCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

// TODO: This test will need to be rewritten to handle testing appropriating user roles/permissions
//   describe('POST /api/tools', function() {
//     it('should route to tool.controller.create', function() {
//       expect(routerStub.post
//         .withArgs('/', 'toolCtrl.create')
//         ).to.have.been.calledOnce;
//     });
//   });

  describe('PUT /api/tools/:id', function() {
    it('should route to tool.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'toolCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/tools/:id', function() {
    it('should route to tool.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'toolCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

// TODO: This test will need to be rewritten to handle testing appropriating user roles/permissions
//   describe('DELETE /api/tools/:id', function() {
//     it('should route to tool.controller.destroy', function() {
//       expect(routerStub.delete
//         .withArgs('/:id', 'toolCtrl.destroy')
//         ).to.have.been.calledOnce;
//     });
//   });
});
