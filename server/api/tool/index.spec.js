/* globals sinon, describe, expect, it */

import { authServiceStub } from '../../auth/auth.service.mock';
import { toolAuthStub } from './tool.auth.mock';

var proxyquire = require('proxyquire').noPreserveCache();

var toolCtrlStub = {
    index: 'toolCtrl.index',
    show: 'toolCtrl.show',
    create: 'toolCtrl.create',
    patch: 'toolCtrl.patch',
    destroy: 'toolCtrl.destroy'
};

var routerStub = {
    get: sinon.spy(),
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
    '../../auth/auth.service': authServiceStub,
    './tool.auth': toolAuthStub,
    './tool.controller': toolCtrlStub,
});

describe('Tool API Router:', function () {
    it('should return an express router instance', function () {
        expect(toolIndex).to.equal(routerStub);
    });

    describe('GET /api/tools', function () {
        it('should route to tool.controller.index', function () {
            expect(routerStub.get
                .withArgs('/', authServiceStub.isAuthenticated(), toolCtrlStub.index)
            ).to.have.been.calledOnce;
        });
    });

    describe('GET /api/tools/:id', function () {
        it('should route to tool.controller.show', function () {
            expect(routerStub.get
                .withArgs('/:id', toolAuthStub.canReadTool(), toolCtrlStub.show)
            ).to.have.been.calledOnce;
        });
    });

    describe('POST /api/tools', function () {
        it('should route to tool.controller.create', function () {
            expect(routerStub.post
                .withArgs('/', toolAuthStub.canCreateTool(), toolCtrlStub.create)
            ).to.have.been.calledOnce;
        });
    });

    describe('PATCH /api/tools/:id', function () {
        it('should route to tool.controller.patch', function () {
            expect(routerStub.patch
                .withArgs('/:id', toolAuthStub.canEditTool(), toolCtrlStub.patch)
            ).to.have.been.calledOnce;
        });
    });

    describe('DELETE /api/tools/:id', function () {
        it('should route to tool.controller.destroy', function () {
            expect(routerStub.delete
                .withArgs('/:id', toolAuthStub.canDeleteTool(), toolCtrlStub.destroy)
            ).to.have.been.calledOnce;
        });
    });
});
