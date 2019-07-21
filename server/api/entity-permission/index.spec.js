/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

import {
    authServiceStub
} from '../../auth/auth.service.mock';

var entityPermissionCtrlStub = {
    index: 'entityPermissionCtrl.index',
    indexMine: 'entityPermissionCtrl.indexMine',
    create: 'entityPermissionCtrl.create',
    patch: 'entityPermissionCtrl.patch',
    destroy: 'entityPermissionCtrl.destroy',
    indexEntityPermissions: 'entityPermissionCtrl.indexEntityPermissions'
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

    describe('GIVEN an authenticated user', () => {
        describe('GET /api/entity-permissions/mine', function () {
            it('should route to entityPermission.controller.indexMine', function () {
                expect(routerStub.get
                    .withArgs('/mine', 'authService.isAuthenticated', 'entityPermissionCtrl.indexMine')
                ).to.have.been.calledOnce;
            });
        });

        describe('GET /api/entity-permissions/', function () {
            it('should NOT route to entityPermission.controller.index', function () {
                expect(routerStub.get
                    .withArgs('/', 'authService.hasRole', 'entityPermissionCtrl.index')
                ).to.not.have.been.calledOnce;
            });
        });

        describe('POST /api/entity-permissions/', function () {
            it('should NOT route to entityPermission.controller.create', function () {
                expect(routerStub.post
                    .withArgs('/', 'authService.hasPermissionForEntity', 'entityPermissionCtrl.create')
                ).to.not.have.been.calledOnce;
            });
        });

        describe('PATCH /api/entity-permissions/:id', function () {
            it('should NOT route to entityPermission.controller.patch', function () {
                expect(routerStub.patch
                    .withArgs('/:id', 'authService.hasPermissionForEntity', 'entityPermissionCtrl.patch')
                ).to.not.have.been.calledOnce;
            });
        });

        describe('DELETE /api/entity-permissions/:id', function () {
            it('should NOT route to entityPermission.controller.destroy', function () {
                expect(routerStub.delete
                    .withArgs('/:id', 'authService.hasPermissionForEntity', 'entityPermissionCtrl.destroy')
                ).to.not.have.been.calledOnce;
            });
        });

        describe('GET /api/entity-permissions/entity/:id', function () {
            it('should NOT route to entityPermission.controller.indexEntityPermissions', function () {
                expect(routerStub.get
                    .withArgs('/entity/:id', 'authService.hasPermissionForEntity', 'entityPermissionCtrl.indexEntityPermissions')
                ).to.not.have.been.calledOnce;
            });
        });

        describe('WHEN they have been assigned an admin role for the portal', () => {
            describe('GET /api/entity-permissions/', function () {
                it('should route to entityPermission.controller.index', function () {
                    expect(routerStub.get
                        .withArgs('/', 'authService.hasRole.admin', 'entityPermissionCtrl.index')
                    ).to.have.been.calledOnce;
                });
            });

            describe('POST /api/entity-permissions/', function () {
                it('should route to entityPermission.controller.create', function () {
                    expect(routerStub.post
                        .withArgs('/', 'authService.hasPermissionForEntity.admin', 'entityPermissionCtrl.create')
                    ).to.have.been.calledOnce;
                });
            });

            describe('PATCH /api/entity-permissions/:id', function () {
                it('should route to entityPermission.controller.patch', function () {
                    expect(routerStub.patch
                        .withArgs('/:id', 'authService.hasPermissionForEntity.admin', 'entityPermissionCtrl.patch')
                    ).to.have.been.calledOnce;
                });
            });

            describe('DELETE /api/entity-permissions/:id', function () {
                it('should route to entityPermission.controller.destroy', function () {
                    expect(routerStub.delete
                        .withArgs('/:id', 'authService.hasPermissionForEntity.admin', 'entityPermissionCtrl.destroy')
                    ).to.have.been.calledOnce;
                });
            });

            describe('GET /api/entity-permissions/entity/:id', function () {
                it('should route to entityPermission.controller.indexEntityPermissions', function () {
                    expect(routerStub.get
                        .withArgs('/entity/:id', 'authService.hasPermissionForEntity.admin', 'entityPermissionCtrl.indexEntityPermissions')
                    ).to.have.been.calledOnce;
                });
            });
        });

        describe('WHEN they have been assigned an admin permission for a specific entity', () => {
            describe('GET /api/entity-permissions/entity/:id', function () {
                it('should route to entityPermission.controller.indexEntityPermissions', function () {
                    expect(routerStub.get
                        .withArgs('/entity/:id', 'authService.hasPermissionForEntity.admin', 'entityPermissionCtrl.indexEntityPermissions')
                    ).to.have.been.calledOnce;
                });
            });
        });
    });
});
