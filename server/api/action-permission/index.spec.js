/* globals sinon, describe, expect, it */

import { authServiceStub } from '../../auth/auth.service.mock';
import { actionPermissionAuthStub } from './action-permission.auth.mock';

var proxyquire = require('proxyquire').noPreserveCache();

var actionPermissionCtrlStub = {
    index: 'actionPermissionCtrl.index',
    indexByUser: 'actionPermissionCtrl.indexByUser',
    create: 'actionPermissionCtrl.create',
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
    '../../auth/auth.service': authServiceStub,
    './action-permission.auth': actionPermissionAuthStub,
    './action-permission.controller': actionPermissionCtrlStub,
});

describe('ActionPermission API Router:', function () {
    it('should return an express router instance', function () {
        expect(actionPermissionIndex).to.equal(routerStub);
    });

    describe('GET /api/action-permissions', function () {
        it('should route to actionPermission.controller.index', function () {
            expect(routerStub.get.withArgs('/', 'authService.isAuthenticated', 'actionPermissionCtrl.index')).to.have
                .been.calledOnce;
        });
    });

    describe('GET /api/action-permissions/users/:userId', function () {
        it('should route to actionPermission.controller.indexByUser', function () {
            expect(
                routerStub.get.withArgs(
                    '/users/:userId',
                    'actionPermissionAuth.canReadActionPermission',
                    'actionPermissionCtrl.indexByUser'
                )
            ).to.have.been.calledOnce;
        });
    });

    describe('POST /api/action-permissions', function () {
        it('should route to actionPermission.controller.create', function () {
            expect(
                routerStub.post.withArgs(
                    '/',
                    'actionPermissionAuth.canCreateActionPermission',
                    'actionPermissionCtrl.create'
                )
            ).to.have.been.calledOnce;
        });
    });

    describe('DELETE /api/action-permissions/:id', function () {
        it('should route to actionPermission.controller.destroy', function () {
            expect(
                routerStub.delete.withArgs(
                    '/:id',
                    'actionPermissionAuth.canDeleteActionPermission',
                    'actionPermissionCtrl.destroy'
                )
            ).to.have.been.calledOnce;
        });
    });
});
