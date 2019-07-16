import { Injectable } from '@angular/core';
import { neoJson } from './mock-data/mockGraphNeo'
import { d3Json } from './mock-data/mockGraphD3'

@Injectable()
export class ProvenanceGraphService {
  getNodesForNeo() {
    return neoJson
  }

  getNodesForD3() {
    return d3Json
  }
}

