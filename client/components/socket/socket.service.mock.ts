import sinon from 'sinon';

export class MockSocketService {
    unsyncUpdates = sinon.spy();
}
