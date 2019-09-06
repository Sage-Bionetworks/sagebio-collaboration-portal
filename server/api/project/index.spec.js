/* globals sinon, describe, expect, it */

import { authServiceStub } from '../../auth/auth.service.mock';
import { projectAuthStub } from './project.auth.mock';

var proxyquire = require('proxyquire').noPreserveCache();

var projectCtrlStub = {
    index: 'projectCtrl.index',
    show: 'projectCtrl.show',
    create: 'projectCtrl.create',
    patch: 'projectCtrl.patch',
    destroy: 'projectCtrl.destroy',
    showVisibility: 'projectCtrl.showVisibility',
    makePublic: 'projectCtrl.makePublic',
    makePrivate: 'projectCtrl.makePrivate'
};

var routerStub = {
    get: sinon.spy(),
    put: sinon.spy(),
    patch: sinon.spy(),
    post: sinon.spy(),
    delete: sinon.spy(),
};

// require the index with our stubbed out modules
var projectIndex = proxyquire('./index.js', {
    express: {
        Router() {
            return routerStub;
        },
    },
    '../../auth/auth.service': authServiceStub,
    './project.auth': projectAuthStub,
    './project.controller': projectCtrlStub,
});

describe.only('Project API Router:', function () {
    it('should return an express router instance', function () {
        expect(projectIndex).to.equal(routerStub);
    });

    describe('GET /api/projects', function () {
        it('should route to project.controller.index', function () {
            expect(routerStub.get.withArgs('/', 'authService.isAuthenticated', 'projectCtrl.index')).to.have.been.calledOnce;
        });
    });

    describe('GET /api/projects/:id', function () {
        it('should route to project.controller.show', function () {
            expect(routerStub.get.withArgs('/:id', 'projectAuth.canReadProject', 'projectCtrl.show')).to.have.been
                .calledOnce;
        });
    });

    describe('POST /api/projects', function () {
        it('should route to project.controller.create', function () {
            expect(routerStub.post.withArgs('/', 'projectAuth.canCreateProject', 'projectCtrl.create')).to.have.been
                .calledOnce;
        });
    });

    describe('PATCH /api/projects/:id', function () {
        it('should route to project.controller.patch', function () {
            expect(routerStub.patch.withArgs('/:id', 'projectAuth.canEditProject', 'projectCtrl.patch')).to.have.been
                .calledOnce;
        });
    });

    describe('DELETE /api/projects/:id', function () {
        it('should route to project.controller.destroy', function () {
            expect(routerStub.delete.withArgs('/:id', 'projectAuth.canDeleteProject', 'projectCtrl.destroy')).to.have.been.calledOnce;
        });
    });

    describe('GET /api/projects/:id/visibility', function () {
        it('should route to project.controller.showVisibility', function () {
            expect(routerStub.get.withArgs('/:id/visibility', 'authService.isAuthenticated', 'projectCtrl.showVisibility')).to.have.been
                .calledOnce;
        });
    });

    describe('PATCH /api/projects/:id/visibility/public', function () {
        it('should route to project.controller.makePublic', function () {
            expect(routerStub.patch.withArgs('/:id/visibility/public', 'projectAuth.canEditProject', 'projectCtrl.makePublic')).to.have.been
                .calledOnce;
        });
    });

    describe('PATCH /api/projects/:id/visibility/private', function () {
        it('should route to project.controller.makePrivate', function () {
            expect(routerStub.patch.withArgs('/:id/visibility/private', 'projectAuth.canEditProject', 'projectCtrl.makePrivate')).to.have.been
                .calledOnce;
        });
    });
});
