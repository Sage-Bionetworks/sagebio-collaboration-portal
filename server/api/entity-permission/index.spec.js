/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

import {
    authServiceStub
} from '../../auth/auth.service.stub';

var entityPermissionCtrlStub = {
    index: 'entityPermissionCtrl.index',
    show: 'entityPermissionCtrl.show',
    create: 'entityPermissionCtrl.create',
    upsert: 'entityPermissionCtrl.upsert',
    patch: 'entityPermissionCtrl.patch',
    destroy: 'entityPermissionCtrl.destroy'
};

var routerStub = {
    get: sinon.spy(),
    put: sinon.spy(),
    patch: sinon.spy(),
    post: sinon.spy(),
    delete: sinon.spy()
};

// require the index with our stubbed out modules
var entityPermissionIndex = proxyquire('./index.js', {
    express: {
        Router() {
            return routerStub;
        }
    },
    './entity-permission.controller': entityPermissionCtrlStub,
    '../../auth/auth.service': authServiceStub
});

describe('EntityPermission API Router:', function () {
    it('should return an express router instance', function () {
        expect(entityPermissionIndex).to.equal(routerStub);
    });

    describe('GET /api/entity-permissions', function () {
        it('should route to entityPermission.controller.index', function () {
            expect(routerStub.get
                .withArgs('/', 'authService.hasRole.admin', 'entityPermissionCtrl.index')
            ).to.have.been.calledOnce;
        });
    });

    // describe('GET /api/entity-permissions/:id', function () {
    //     it('should route to entityPermission.controller.show', function () {
    //         expect(routerStub.get
    //             .withArgs('/:id', 'entityPermissionCtrl.show')
    //         ).to.have.been.calledOnce;
    //     });
    // });

    // describe('POST /api/entity-permissions', function () {
    //     it('should route to entityPermission.controller.create', function () {
    //         expect(routerStub.post
    //             .withArgs('/', 'entityPermissionCtrl.create')
    //         ).to.have.been.calledOnce;
    //     });
    // });

    // describe('PUT /api/entity-permissions/:id', function () {
    //     it('should route to entityPermission.controller.upsert', function () {
    //         expect(routerStub.put
    //             .withArgs('/:id', 'entityPermissionCtrl.upsert')
    //         ).to.have.been.calledOnce;
    //     });
    // });

    // describe('PATCH /api/entity-permissions/:id', function () {
    //     it('should route to entityPermission.controller.patch', function () {
    //         expect(routerStub.patch
    //             .withArgs('/:id', 'entityPermissionCtrl.patch')
    //         ).to.have.been.calledOnce;
    //     });
    // });

    // describe('DELETE /api/entity-permissions/:id', function () {
    //     it('should route to entityPermission.controller.destroy', function () {
    //         expect(routerStub.delete
    //             .withArgs('/:id', 'entityPermissionCtrl.destroy')
    //         ).to.have.been.calledOnce;
    //     });
    // });
});
