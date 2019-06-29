/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var userPermissionCtrlStub = {
    index: 'userPermissionCtrl.index',
    show: 'userPermissionCtrl.show',
    create: 'userPermissionCtrl.create',
    upsert: 'userPermissionCtrl.upsert',
    patch: 'userPermissionCtrl.patch',
    destroy: 'userPermissionCtrl.destroy'
};

var routerStub = {
    get: sinon.spy(),
    put: sinon.spy(),
    patch: sinon.spy(),
    post: sinon.spy(),
    delete: sinon.spy()
};

// require the index with our stubbed out modules
var userPermissionIndex = proxyquire('./index.js', {
    express: {
        Router() {
            return routerStub;
        }
    },
    './user-permission.controller': userPermissionCtrlStub
});

describe('UserPermission API Router:', function () {
    it('should return an express router instance', function () {
        expect(userPermissionIndex).to.equal(routerStub);
    });

    describe('GET /api/user-permissions', function () {
        it('should route to userPermission.controller.index', function () {
            expect(routerStub.get
                .withArgs('/', 'userPermissionCtrl.index')
            ).to.have.been.calledOnce;
        });
    });

    // describe('GET /api/user-permissions/:id', function () {
    //     it('should route to userPermission.controller.show', function () {
    //         expect(routerStub.get
    //             .withArgs('/:id', 'userPermissionCtrl.show')
    //         ).to.have.been.calledOnce;
    //     });
    // });

    // describe('POST /api/user-permissions', function () {
    //     it('should route to userPermission.controller.create', function () {
    //         expect(routerStub.post
    //             .withArgs('/', 'userPermissionCtrl.create')
    //         ).to.have.been.calledOnce;
    //     });
    // });

    // describe('PUT /api/user-permissions/:id', function () {
    //     it('should route to userPermission.controller.upsert', function () {
    //         expect(routerStub.put
    //             .withArgs('/:id', 'userPermissionCtrl.upsert')
    //         ).to.have.been.calledOnce;
    //     });
    // });

    // describe('PATCH /api/user-permissions/:id', function () {
    //     it('should route to userPermission.controller.patch', function () {
    //         expect(routerStub.patch
    //             .withArgs('/:id', 'userPermissionCtrl.patch')
    //         ).to.have.been.calledOnce;
    //     });
    // });

    // describe('DELETE /api/user-permissions/:id', function () {
    //     it('should route to userPermission.controller.destroy', function () {
    //         expect(routerStub.delete
    //             .withArgs('/:id', 'userPermissionCtrl.destroy')
    //         ).to.have.been.calledOnce;
    //     });
    // });
});
