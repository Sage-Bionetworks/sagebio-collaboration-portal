/* globals sinon, describe, expect, it */

import { authServiceStub } from '../../auth/auth.service.mock';
import { entityPermissionAuthStub } from './entity-permission.auth.mock';

var proxyquire = require('proxyquire').noPreserveCache();

var entityPermissionCtrlStub = {
    index: 'entityPermissionCtrl.index',
    indexByEntity: 'entityPermissionCtrl.indexByEntity',
    show: 'entityPermissionCtrl.show',
    create: 'entityPermissionCtrl.create',
    patch: 'entityPermissionCtrl.patch',
    destroy: 'entityPermissionCtrl.destroy',
};

var routerStub = {
    get: sinon.spy(),
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

    describe('An authenticated user', () => {
        describe('WITH an admin role for the portal', () => {
            describe('GET /api/entity-permissions/entity/:entityId', function () {
                it('should route to entityPermission.controller.indexByEntity', function () {
                    expect(
                        routerStub.get.withArgs(
                            '/entity/:entityId',
                            authServiceStub.isAuthenticated(),
                            entityPermissionCtrlStub.indexByEntity
                        )
                    ).to.have.been.calledOnce;
                });
            });

            describe('POST /api/entity-permissions/', function () {
                it('should route to entityPermission.controller.create', function () {
                    expect(
                        routerStub.post.withArgs(
                            '/',
                            entityPermissionAuthStub.canCreateEntityPermission(),
                            'entityPermissionCtrl.create'
                        )
                    ).to.have.been.calledOnce;
                });
            });

            describe('PATCH /api/entity-permissions/:id', function () {
                it('should route to entityPermission.controller.patch', function () {
                    expect(
                        routerStub.patch.withArgs(
                            '/:id',
                            entityPermissionAuthStub.canEditEntityPermission(),
                            'entityPermissionCtrl.patch'
                        )
                    ).to.have.been.calledOnce;
                });
            });

            describe('DELETE /api/entity-permissions/:id', function () {
                it('should route to entityPermission.controller.destroy', function () {
                    expect(
                        routerStub.delete.withArgs(
                            '/:id',
                            entityPermissionAuthStub.canDeleteEntityPermission(),
                            'entityPermissionCtrl.destroy'
                        )
                    ).to.have.been.calledOnce;
                });
            });
        });

        describe('WITHOUT an admin role for the portal', () => {
            describe('GET /api/entity-permissions/', function () {
                it('should route to entityPermission.controller.index', function () {
                    expect(
                        routerStub.get.withArgs('/', authServiceStub.isAuthenticated(), 'entityPermissionCtrl.index')
                    ).to.have.been.calledOnce;
                });
            });

            describe('GET /api/entity-permissions/:id', function () {
                it('should route to entityPermission.controller.show', function () {
                    expect(
                        routerStub.get.withArgs('/:id', authServiceStub.isAuthenticated(), 'entityPermissionCtrl.show')
                    ).to.have.been.calledOnce;
                });
            });

            describe('WITH an explicitly assigned', () => {
                describe('"create" entity permission', () => {
                    describe('POST /api/entity-permissions/', function () {
                        it('should route to entityPermission.controller.create', function () {
                            expect(
                                routerStub.post.withArgs(
                                    '/',
                                    entityPermissionAuthStub.canCreateEntityPermission(),
                                    'entityPermissionCtrl.create'
                                )
                            ).to.have.been.calledOnce;
                        });
                    });
                });

                describe('"edit" permission for a specific entity permission ID', () => {
                    describe('PATCH /api/entity-permissions/:id', function () {
                        it('should route to entityPermission.controller.patch', function () {
                            expect(
                                routerStub.patch.withArgs(
                                    '/:id',
                                    entityPermissionAuthStub.canEditEntityPermission(),
                                    'entityPermissionCtrl.patch'
                                )
                            ).to.have.been.calledOnce;
                        });
                    });
                });

                describe('"delete" permission for a specific entity permission ID', () => {
                    describe('DELETE /api/entity-permissions/:id', function () {
                        it('should route to entityPermission.controller.destroy', function () {
                            expect(
                                routerStub.delete.withArgs(
                                    '/:id',
                                    entityPermissionAuthStub.canDeleteEntityPermission(),
                                    'entityPermissionCtrl.destroy'
                                )
                            ).to.have.been.calledOnce;
                        });
                    });
                });

                // describe('"read" permission for a specific entity ID', () => {
                //     describe('GET /api/entity-permissions/entity/:entityId', function () {
                //         it('should route to entityPermission.controller.indexByEntity', function () {
                //             expect(
                //                 routerStub.get.withArgs(
                //                     '/entity/:entityId',
                //                     entityPermissionAuthStub.canReadEntityPermission(),
                //                     'entityPermissionCtrl.indexByEntity'
                //                 )
                //             ).to.have.been.calledOnce;
                //         });
                //     });
                // });
            });
        });
    });
});
