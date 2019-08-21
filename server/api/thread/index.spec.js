/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var threadCtrlStub = {
    createThread: 'threadCtrl.createThread',
};

var authServiceStub = {
    isAuthenticated() {
        return 'authService.isAuthenticated';
    },
    hasRole(role) {
        return `authService.hasRole.${role}`;
    },
    hasPermissionForEntity() {
        return 'authService.hasPermissionForEntity';
    },
};

var routerStub = {
    get: sinon.spy(),
    put: sinon.spy(),
    patch: sinon.spy(),
    post: sinon.spy(),
    delete: sinon.spy()
};

// require the index with our stubbed out modules
var threadIndex = proxyquire('./index.js', {
    express: {
        Router() {
            return routerStub;
        }
    },
    './thread.controller': threadCtrlStub,
    '../../auth/auth.service': authServiceStub
});

describe('Thread API Router', function () {
    it('should return an express router instance', function () {
        expect(threadIndex).to.equal(routerStub);
    });

    // describe('POST /api/threads/entity/:entityId', function () {
    //     it('should route to thread.controller.createThread', function () {
    //         expect(routerStub.post
    //             .withArgs('/threads/entity/:entityId', 'authService.hasPermissionForEntity', 'threadCtrl.createThread')
    //         ).to.have.been.calledOnce;
    //     });
    // });
});
