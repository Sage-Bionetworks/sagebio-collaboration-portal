import { Injectable } from '@angular/core';
import { fullNeoJson } from './temporal-mock-data/mockGraphNeo'
import { d3Json } from './temporal-mock-data/mockGraphD3'
import { neoJson } from './temporal-mock-data/smallMockGraphNeo'

@Injectable()
export class ProvenanceNeoGraphService {
  getFullNodesInNeoFormat() {
    return fullNeoJson
  }

  getNodesForD3Format() {
    return d3Json
  }

  getSmallNodesInNeoFormat() {
    return neoJson
  }
}

