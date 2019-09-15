import sinon from 'sinon';
import { of } from 'rxjs';

export class ProvenanceServiceMock {
    getProvenanceGraphByAgent = sinon.fake.returns(of({ results: [] }));
    getProvenanceGraphByReference = sinon.fake.returns(of({ results: [] }));
}
