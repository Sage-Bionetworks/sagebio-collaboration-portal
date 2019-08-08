/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var messageCtrlStub = {
    index: 'messageCtrl.index',
    show: 'messageCtrl.show',
    create: 'messageCtrl.create',
    upsert: 'messageCtrl.upsert',
    patch: 'messageCtrl.patch',
    destroy: 'messageCtrl.destroy',
    test: 'messageCtrl.test',
    indexThreads: 'messageCtrl.indexThreads',
    indexThreadsForEntity: 'messageCtrl.indexThreadsForEntity',
    showMessagesForThread: 'messageCtrl.showMessagesForThread',
    createThread: 'messageCtrl.createThread',
    addMessageToThread: 'messageCtrl.addMessageToThread',
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
var messageIndex = proxyquire('./index.js', {
    express: {
        Router() {
            return routerStub;
        }
    },
    './message.controller': messageCtrlStub,
    '../../auth/auth.service': authServiceStub
});

describe('Message API Router:', function () {
    it('should return an express router instance', function () {
        expect(messageIndex).to.equal(routerStub);
    });

    describe('GET /api/messages', function () {
        it('should route to message.controller.index', function () {
            expect(routerStub.get
                .withArgs('/', 'messageCtrl.index')
            ).to.have.been.calledOnce;
        });
    });

    describe('GET /api/messages/:id', function () {
        it('should route to message.controller.show', function () {
            expect(routerStub.get
                .withArgs('/:id', 'messageCtrl.show')
            ).to.have.been.calledOnce;
        });
    });

    describe('POST /api/messages', function () {
        it('should route to message.controller.create', function () {
            expect(routerStub.post
                .withArgs('/', 'authService.isAuthenticated', 'messageCtrl.create')
            ).to.have.been.calledOnce;
        });
    });

    // describe('PUT /api/messages/:id', function () {
    //     it('should route to message.controller.upsert', function () {
    //         expect(routerStub.put
    //             .withArgs('/:id', 'messageCtrl.upsert')
    //         ).to.have.been.calledOnce;
    //     });
    // });

    describe('PATCH /api/messages/:id', function () {
        it('should route to message.controller.patch', function () {
            expect(routerStub.patch
                .withArgs('/:id', 'messageCtrl.patch')
            ).to.have.been.calledOnce;
        });
    });

    describe('DELETE /api/messages/:id', function () {
        it('should route to message.controller.destroy', function () {
            expect(routerStub.delete
                .withArgs('/:id', 'messageCtrl.destroy')
            ).to.have.been.calledOnce;
        });
    });

    // Threads
    // POST /messages/threads/  -> Create a new thread and a new message ID that is not associated with an entity ID
    describe('POST /api/messages/threads', function () {
        it('should route to message.controller.createThread', function () {
            expect(routerStub.post
                .withArgs('/threads', 'authService.isAuthenticated', 'messageCtrl.createThread')
            ).to.have.been.calledOnce;
        });
    });

    // GET /messages/threads/   -> Get all threads that are not associated with an entity ID
    describe('GET /api/messages/threads', function () {
        it('should route to message.controller.indexThreads', function () {
            expect(routerStub.get
                .withArgs('/threads', 'authService.isAuthenticated', 'messageCtrl.indexThreads')
            ).to.have.been.calledOnce;
        });
    });

    // POST /messages/threads/:id    -> Add a Message to a specific thread ID not associated with an entity ID
    describe('POST /api/messages/threads/:id', function () {
        it('should route to message.controller.addMessageToThread', function () {
            expect(routerStub.post
                .withArgs('/threads/:id', 'authService.isAuthenticated', 'messageCtrl.addMessageToThread')
            ).to.have.been.calledOnce;
        });
    });

    // GET /messages/threads/messages/:id   -> Get messages from a specific thread ID not associated with an entity ID
    describe('GET /api/messages/threads/messages/:id', function () {
        it('should route to message.controller.test', function () {
            expect(routerStub.get
                .withArgs('/threads/messages/:id', 'authService.isAuthenticated', 'messageCtrl.showMessagesForThread')
            ).to.have.been.calledOnce;
        });
    });

    // GET /messages/threads/entity/:entityId   -> Get all threads for a specific entity ID
    describe('GET /api/messages/threads/entity/:entityId', function () {
        it('should route to message.controller.indexThreadsForEntity', function () {
            expect(routerStub.get
                .withArgs('/threads/entity/:entityId', 'authService.hasPermissionForEntity', 'messageCtrl.indexThreadsForEntity')
            ).to.have.been.calledOnce;
        });
    });

});
