/* globals sinon, describe, expect, it */

import { authServiceStub } from '../../auth/auth.service.mock';
import { toolAuthStub } from './tool.auth.mock';

var proxyquire = require('proxyquire').noPreserveCache();

var toolCtrlStub = {
    index: 'toolCtrl.index',
    show: 'toolCtrl.show',
    create: 'toolCtrl.create',
    upsert: 'toolCtrl.upsert',
    patch: 'toolCtrl.patch',
    destroy: 'toolCtrl.destroy'
};

var routerStub = {
    get: sinon.spy(),
    put: sinon.spy(),
    patch: sinon.spy(),
    post: sinon.spy(),
    delete: sinon.spy()
};

// require the index with our stubbed out modules
var toolIndex = proxyquire('./index.js', {
    express: {
        Router() {
            return routerStub;
        }
    },
    './tool.controller': toolCtrlStub,
    '../../auth/auth.service': authServiceStub,
    './tool.auth': toolAuthStub,
});

describe('Tool API Router:', function () {
    it('should return an express router instance', function () {
        expect(toolIndex).to.equal(routerStub);
    });

    describe('GET /api/tools', function () {
        it('should route to tool.controller.index', function () {
            expect(routerStub.get
                .withArgs('/', 'authService.isAuthenticated', 'toolCtrl.index')
            ).to.have.been.calledOnce;
        });
    });

    describe('GET /api/tools/:id', function () {
        it('should route to tool.controller.show', function () {
            expect(routerStub.get
                .withArgs('/:id', 'toolAuth.canReadTool', 'toolCtrl.show')
            ).to.have.been.calledOnce;
        });
    });

    describe('POST /api/tools', function () {
        it('should route to tool.controller.create', function () {
            expect(routerStub.post
                .withArgs('/', 'toolAuth.canCreateTool', 'toolCtrl.create')
            ).to.have.been.calledOnce;
        });
    });

    describe('PATCH /api/tools/:id', function () {
        it('should route to tool.controller.patch', function () {
            expect(routerStub.patch
                .withArgs('/:id', 'toolAuth.canEditTool', 'toolCtrl.patch')
            ).to.have.been.calledOnce;
        });
    });

    describe('DELETE /api/tools/:id', function () {
        it('should route to tool.controller.destroy', function () {
            expect(routerStub.delete
                .withArgs('/:id', 'toolAuth.canDeleteTool', 'toolCtrl.destroy')
            ).to.have.been.calledOnce;
        });
    });
});
