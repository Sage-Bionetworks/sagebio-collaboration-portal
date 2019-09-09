/* globals sinon, describe, expect, it */

import { authServiceStub } from '../../auth/auth.service.mock';
import { entityPermissionAuthStub } from './entity-permission.auth.mock';

var proxyquire = require('proxyquire').noPreserveCache();

var entityPermissionCtrlStub = {
    index: 'entityPermissionCtrl.index',
    // indexMine: 'entityPermissionCtrl.indexMine',
    // indexByEntity: 'entityPermissionCtrl.indexByEntity',
    // create: 'entityPermissionCtrl.create',
    // patch: 'entityPermissionCtrl.patch',
    // destroy: 'entityPermissionCtrl.destroy',
};

var routerStub = {
    get: sinon.spy(),
    put: sinon.spy(),
    patch: sinon.spy(),
    post: sinon.spy(),
    delete: sinon.spy(),
};

// require the index with our stubbed out modules
var entityPermissionIndex = proxyquire('./index.js', {
    express: {
        Router() {
            return routerStub;
        },
    },
    '../../auth/auth.service': authServiceStub,
    './entity-permission.auth': entityPermissionAuthStub,
    './entity-permission.controller': entityPermissionCtrlStub,
});

describe('EntityPermission API Router:', function () {
    it('should return an express router instance', function () {
        expect(entityPermissionIndex).to.equal(routerStub);
    });

    describe('GIVEN an authenticated user', () => { // TODO Ask Rob about the logic he implemented
        describe('GET /api/entity-permissions', function () {
            it('should route to entityPermission.controller.index', function () {
                expect(routerStub.get.withArgs('/', 'authService.isAuthenticated', 'entityPermissionCtrl.index')).to
                    .have.been.calledOnce;
            });
        });

        // describe('POST /api/entity-permissions/', function () {
        //     it('should NOT route to entityPermission.controller.create', function () {
        //         expect(
        //             routerStub.post.withArgs(
        //                 '/entity/:entityId',
        //                 'authService.hasPermissionForEntity',
        //                 'entityPermissionCtrl.create'
        //             )
        //         ).to.not.have.been.calledOnce;
        //     });
        // });

        // describe('PATCH /api/entity-permissions/:id', function () {
        //     it('should NOT route to entityPermission.controller.patch', function () {
        //         expect(
        //             routerStub.patch.withArgs(
        //                 '/entity/:entityId/:id',
        //                 'authService.hasPermissionForEntity',
        //                 'entityPermissionCtrl.patch'
        //             )
        //         ).to.not.have.been.calledOnce;
        //     });
        // });

        // describe('DELETE /api/entity-permissions/:id', function () {
        //     it('should NOT route to entityPermission.controller.destroy', function () {
        //         expect(
        //             routerStub.delete.withArgs(
        //                 '/entity/:entityId/:id',
        //                 'authService.hasPermissionForEntity',
        //                 'entityPermissionCtrl.destroy'
        //             )
        //         ).to.not.have.been.calledOnce;
        //     });
        // });

        // describe('GET /api/entity-permissions/entity/:id', function () {
        //     it('should NOT route to entityPermission.controller.indexByEntity', function () {
        //         expect(
        //             routerStub.get.withArgs(
        //                 '/entity/:entityId/entity/:entityId',
        //                 'authService.hasPermissionForEntity',
        //                 'entityPermissionCtrl.indexByEntity'
        //             )
        //         ).to.not.have.been.calledOnce;
        //     });
        // });

        // describe('WHEN they have been assigned an admin role for the portal', () => {
        //     describe('GET /api/entity-permissions/', function () {
        //         it('should route to entityPermission.controller.index', function () {
        //             expect(routerStub.get.withArgs('/', 'authService.hasRole.Admin', 'entityPermissionCtrl.index')).to
        //                 .have.been.calledOnce;
        //         });
        //     });

        //     describe('POST /api/entity-permissions/entity/:entityId', function () {
        //         it('should route to entityPermission.controller.create', function () {
        //             expect(
        //                 routerStub.post.withArgs(
        //                     '/entity/:entityId',
        //                     'authService.hasPermissionForEntity.admin',
        //                     'entityPermissionCtrl.create'
        //                 )
        //             ).to.have.been.calledOnce;
        //         });
        //     });

        //     describe('PATCH /api/entity-permissions/entity/:entityId/:id', function () {
        //         it('should route to entityPermission.controller.patch', function () {
        //             expect(
        //                 routerStub.patch.withArgs(
        //                     '/entity/:entityId/:id',
        //                     'authService.hasPermissionForEntity.admin',
        //                     'entityPermissionCtrl.patch'
        //                 )
        //             ).to.have.been.calledOnce;
        //         });
        //     });

        //     describe('DELETE /api/entity-permissions/entity/:entityId/:id', function () {
        //         it('should route to entityPermission.controller.destroy', function () {
        //             expect(
        //                 routerStub.delete.withArgs(
        //                     '/entity/:entityId/:id',
        //                     'authService.hasPermissionForEntity.admin',
        //                     'entityPermissionCtrl.destroy'
        //                 )
        //             ).to.have.been.calledOnce;
        //         });
        //     });

        //     describe('GET /api/entity-permissions/entity/:entityId', function () {
        //         it('should route to entityPermission.controller.indexByEntity', function () {
        //             expect(
        //                 routerStub.get.withArgs(
        //                     '/entity/:entityId',
        //                     'authService.hasPermissionForEntity.admin',
        //                     'entityPermissionCtrl.indexByEntity'
        //                 )
        //             ).to.have.been.calledOnce;
        //         });
        //     });
        // });

        // describe('WHEN they have been assigned an admin permission for a specific entity', () => {
        //     describe('GET /api/entity-permissions/entity/:entityId/:id', function () {
        //         it('should route to entityPermission.controller.indexByEntity', function () {
        //             expect(routerStub.get
        //                 .withArgs('/entity/:entityId/:id', 'authService.hasPermissionForEntity.admin', 'entityPermissionCtrl.indexByEntity')
        //             ).to.have.been.calledOnce;
        //         });
        //     });
        // });
    });
});
