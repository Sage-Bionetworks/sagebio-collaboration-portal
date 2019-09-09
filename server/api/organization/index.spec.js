/* globals sinon, describe, expect, it */

import { authServiceStub } from '../../auth/auth.service.mock';
import { organizationAuthStub } from './organization.auth.mock';

var proxyquire = require('proxyquire').noPreserveCache();

var organizationCtrlStub = {
    index: 'organizationCtrl.index',
    show: 'organizationCtrl.show',
    create: 'organizationCtrl.create',
    patch: 'organizationCtrl.patch',
    destroy: 'organizationCtrl.destroy',
};

var routerStub = {
    get: sinon.spy(),
    put: sinon.spy(),
    patch: sinon.spy(),
    post: sinon.spy(),
    delete: sinon.spy(),
};

// require the index with our stubbed out modules
var organizationIndex = proxyquire('./index.js', {
    express: {
        Router() {
            return routerStub;
        },
    },
    '../../auth/auth.service': authServiceStub,
    './organization.auth': organizationAuthStub,
    './organization.controller': organizationCtrlStub,
});

describe('Organization API Router:', function () {
    it('should return an express router instance', function () {
        expect(organizationIndex).to.equal(routerStub);
    });

    describe('GET /api/organizations', function () {
        it('should route to organization.controller.index', function () {
            expect(routerStub.get.withArgs('/', 'authService.isAuthenticated', 'organizationCtrl.index')).to.have.been
                .calledOnce;
        });
    });

    describe('GET /api/organizations/:id', function () {
        it('should route to organization.controller.show', function () {
            expect(routerStub.get.withArgs('/:id', 'authService.isAuthenticated', 'organizationCtrl.show')).to.have.been
                .calledOnce;
        });
    });

    describe('POST /api/organizations', function () {
        it('should route to organization.controller.create', function () {
            expect(routerStub.post.withArgs('/', 'organizationAuth.canCreateOrganization', 'organizationCtrl.create'))
                .to.have.been.calledOnce;
        });
    });

    describe('PATCH /api/organizations/:id', function () {
        it('should route to organization.controller.patch', function () {
            expect(routerStub.patch.withArgs('/:id', 'organizationAuth.canEditOrganization', 'organizationCtrl.patch'))
                .to.have.been.calledOnce;
        });
    });

    describe('DELETE /api/organizations/:id', function () {
        it('should route to organization.controller.destroy', function () {
            expect(
                routerStub.delete.withArgs('/:id', 'organizationAuth.canDeleteOrganization', 'organizationCtrl.destroy')
            ).to.have.been.calledOnce;
        });
    });
});
