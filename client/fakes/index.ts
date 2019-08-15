import sinon from 'sinon';
import { of } from "rxjs";

export class MockSecondarySidenavService {
  close = sinon.spy()
  destroyContentComponent = sinon.spy()
}

export class MockProvenanceService {
  getProvenanceGraphByAgent = sinon.fake.returns(of({ results: [] }))
  getProvenanceGraphByReference = sinon.fake.returns(of({ results: [] }))
}

export class MockSocketService {
  unsyncUpdates = sinon.spy()
}