/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var actionPermissionCtrlStub = {
    index: 'actionPermissionCtrl.index',
    show: 'actionPermissionCtrl.show',
    create: 'actionPermissionCtrl.create',
    upsert: 'actionPermissionCtrl.upsert',
    patch: 'actionPermissionCtrl.patch',
    destroy: 'actionPermissionCtrl.destroy',
};

var routerStub = {
    get: sinon.spy(),
    put: sinon.spy(),
    patch: sinon.spy(),
    post: sinon.spy(),
    delete: sinon.spy(),
};

// require the index with our stubbed out modules
var actionPermissionIndex = proxyquire('./index.js', {
    express: {
        Router() {
            return routerStub;
        },
    },
    './action-permission.controller': actionPermissionCtrlStub,
});

describe('UserPermission API Router:', function () {
    it('should return an express router instance', function () {
        expect(actionPermissionIndex).to.equal(routerStub);
    });

    describe('GET /api/action-permissions', function () {
        it('should route to actionPermission.controller.index', function () {
            expect(routerStub.get.withArgs('/', 'actionPermissionCtrl.index')).to.have.been.calledOnce;
        });
    });

    // describe('GET /api/action-permissions/:id', function () {
    //     it('should route to actionPermission.controller.show', function () {
    //         expect(routerStub.get
    //             .withArgs('/:id', 'actionPermissionCtrl.show')
    //         ).to.have.been.calledOnce;
    //     });
    // });

    // describe('POST /api/action-permissions', function () {
    //     it('should route to actionPermission.controller.create', function () {
    //         expect(routerStub.post
    //             .withArgs('/', 'actionPermissionCtrl.create')
    //         ).to.have.been.calledOnce;
    //     });
    // });

    // describe('PUT /api/action-permissions/:id', function () {
    //     it('should route to actionPermission.controller.upsert', function () {
    //         expect(routerStub.put
    //             .withArgs('/:id', 'actionPermissionCtrl.upsert')
    //         ).to.have.been.calledOnce;
    //     });
    // });

    // describe('PATCH /api/action-permissions/:id', function () {
    //     it('should route to actionPermission.controller.patch', function () {
    //         expect(routerStub.patch
    //             .withArgs('/:id', 'actionPermissionCtrl.patch')
    //         ).to.have.been.calledOnce;
    //     });
    // });

    // describe('DELETE /api/action-permissions/:id', function () {
    //     it('should route to actionPermission.controller.destroy', function () {
    //         expect(routerStub.delete
    //             .withArgs('/:id', 'actionPermissionCtrl.destroy')
    //         ).to.have.been.calledOnce;
    //     });
    // });
});
