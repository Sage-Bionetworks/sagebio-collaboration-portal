/* globals sinon, describe, expect, it */

import { authServiceStub } from '../../auth/auth.service.mock';
import { userAuthStub } from './user.auth.mock';

var proxyquire = require('proxyquire').noPreserveCache();

var userCtrlStub = {
    index: 'userCtrl.index',
    me: 'userCtrl.me',
    show: 'userCtrl.show',
    create: 'userCtrl.create',
    patch: 'userCtrl.patch',
    changePassword: 'userCtrl.changePassword',
    changeRole: 'userCtrl.changeRole',
    destroy: 'userCtrl.destroy',
};

var routerStub = {
    get: sinon.spy(),
    put: sinon.spy(),
    post: sinon.spy(),
    delete: sinon.spy(),
    patch: sinon.spy(),
};

// require the index with our stubbed out modules
var userIndex = proxyquire('./index', {
    express: {
        Router() {
            return routerStub;
        },
    },
    '../../auth/auth.service': authServiceStub,
    './user.auth': userAuthStub,
    './user.controller': userCtrlStub,
});

describe('User API Router:', function () {
    it('should return an express router instance', function () {
        expect(userIndex).to.equal(routerStub);
    });

    describe('GET /api/users', function () {
        it('should verify admin role and route to user.controller.index', function () {
            expect(routerStub.get.withArgs('/', 'authService.isAuthenticated', 'userCtrl.index')).to.have.been
                .calledOnce;
        });
    });

    describe('GET /api/users/me', function () {
        it('should be authenticated and route to user.controller.me', function () {
            expect(routerStub.get.withArgs('/me', 'authService.isAuthenticated', 'userCtrl.me')).to.have.been
                .calledOnce;
        });
    });

    describe('GET /api/users/:id', function () {
        it('should be authenticated and route to user.controller.show', function () {
            expect(routerStub.get.withArgs('/:id', 'authService.isAuthenticated', 'userCtrl.show')).to.have.been
                .calledOnce;
        });
    });

    describe('POST /api/users', function () {
        it('should route to user.controller.create', function () {
            expect(routerStub.post.withArgs('/', 'userAuth.canCreateUser', 'userCtrl.create')).to.have.been.calledOnce;
        });
    });

    describe('PUT /api/users/:id/password', function () {
        it('should be authenticated and route to user.controller.changePassword', function () {
            expect(routerStub.put.withArgs('/:id/password', 'userAuth.canEditUser', 'userCtrl.changePassword'))
                .to.have.been.calledOnce;
        });
    });

    describe('PUT /api/users/:id/role', function () {
        it('should be authenticated and route to user.controller.changeRole', function () {
            expect(routerStub.put.withArgs('/:id/role', 'userAuth.canChangeRole', 'userCtrl.changeRole'))
                .to.have.been.calledOnce;
        });
    });

    describe('PATCH /api/users/:id', function () {
        it('should be authenticated and route to user.controller.patch', function () {
            expect(routerStub.patch.withArgs('/:id', 'userAuth.canEditUser', 'userCtrl.patch')).to.have.been
                .calledOnce;
        });
    });

    describe('DELETE /api/users/:id', function () {
        it('should verify admin role and route to user.controller.destroy', function () {
            expect(routerStub.delete.withArgs('/:id', 'userAuth.canDeleteUser', 'userCtrl.destroy')).to.have.been
                .calledOnce;
        });
    });
});
