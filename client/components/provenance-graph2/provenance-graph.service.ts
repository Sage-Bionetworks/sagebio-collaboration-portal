import { Injectable } from '@angular/core';
import { neoJson } from './temporal-mock-data/mockGraphNeo'
import { d3Json } from './temporal-mock-data/mockGraphD3'

@Injectable()
export class ProvenanceGraphService {
  getNodesInNeoFormat() {
    return neoJson
  }

  getNodesForD3Format() {
    return d3Json
  }
}

