/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var organizationCtrlStub = {
    index: 'organizationCtrl.index',
    show: 'organizationCtrl.show',
    create: 'organizationCtrl.create',
    patch: 'organizationCtrl.patch',
    destroy: 'organizationCtrl.destroy'
};

var authServiceStub = {
    isAuthenticated() {
        return 'authService.isAuthenticated';
    },
    hasRole(role) {
        return `authService.hasRole.${role}`;
    },
    hasPermission(permission) {
        return `authService.hasPermission.${permission}`;
    }
};

var routerStub = {
    get: sinon.spy(),
    put: sinon.spy(),
    patch: sinon.spy(),
    post: sinon.spy(),
    delete: sinon.spy()
};

// require the index with our stubbed out modules
var organizationIndex = proxyquire('./index.js', {
    express: {
        Router() {
            return routerStub;
        }
    },
    './organization.controller': organizationCtrlStub,
    '../../auth/auth.service': authServiceStub
});

describe('Organization API Router:', function () {
    it('should return an express router instance', function () {
        expect(organizationIndex).to.equal(routerStub);
    });

    describe('GET /api/organizations', function () {
        it('should route to organization.controller.index', function () {
            expect(routerStub.get
                .withArgs('/', 'authService.isAuthenticated', 'organizationCtrl.index')
            ).to.have.been.calledOnce;
        });
    });

    describe('GET /api/organizations/:id', function () {
        it('should route to organization.controller.show', function () {
            expect(routerStub.get
                .withArgs('/:id', 'authService.isAuthenticated', 'organizationCtrl.show')
            ).to.have.been.calledOnce;
        });
    });

    describe('POST /api/organizations', function () {
        it('should route to organization.controller.create', function () {
            expect(routerStub.post
                .withArgs('/', 'authService.hasRole.admin', 'organizationCtrl.create')
            ).to.have.been.calledOnce;
        });
    });

    describe('PATCH /api/organizations/:id', function () {
        it('should route to organization.controller.patch', function () {
            expect(routerStub.patch
                .withArgs('/:id', 'authService.hasRole.admin', 'organizationCtrl.patch')
            ).to.have.been.calledOnce;
        });
    });

    describe('DELETE /api/organizations/:id', function () {
        it('should route to organization.controller.destroy', function () {
            expect(routerStub.delete
                .withArgs('/:id', 'authService.hasRole.admin', 'organizationCtrl.destroy')
            ).to.have.been.calledOnce;
        });
    });
});
