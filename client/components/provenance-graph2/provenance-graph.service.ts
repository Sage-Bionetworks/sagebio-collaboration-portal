import { Injectable } from '@angular/core';
import { neoJson } from './mock-data/mockGraphNeo'
import { d3Json } from './mock-data/mockGraphD3'

@Injectable()
export class ProvenanceGraphService {
  getNodesInNeoFormat() {
    return neoJson
  }

  getNodesForD3Format() {
    return d3Json
  }
}

