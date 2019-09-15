import sinon from 'sinon';

export class MockSecondarySidenavService {
    close = sinon.spy();
    destroyContentComponent = sinon.spy();
}
