import { Component } from '@angular/core';
import { ProvenanceNodeComponent } from '../provenance-node/provenance-node.component';
import { get } from 'lodash'

@Component({
    selector: '[referenceNode]',
    template: require('./reference-node.html'),
    styles: [require('./reference-node.scss')]
})
export class ReferenceNodeComponent extends ProvenanceNodeComponent {
  private classIconMap = {
    'Insight': '&#xf0eb', // lightbulb-o
    'Resource': '&#xf1b2', // cube
    'Tool': '&#xf013', // gear,cog
    'Message': '&#xf075', // comment
  }

  subclassImageMap = {
    File: 'assets/images/provenence-graph/1f4c4.svg',
    State: 'assets/images/provenence-graph/1f4be.svg',
    Dashboard: 'assets/images/provenence-graph/1f39b.svg',
    App: 'assets/images/provenence-graph/1f4bb.svg',
    Notebook: 'assets/images/provenence-graph/1f4ca.svg',
    Protocol: 'assets/images/provenence-graph/2697.svg',
    Report: 'assets/images/provenence-graph/1f4cb.svg',
    Memo: 'assets/images/provenence-graph/1f516.svg',
    Star: 'assets/images/provenence-graph/2b50.svg'
  }

  get icon() {
      return get(this.classIconMap, `[${this.node.nodeClass}]`)
  }

  get color() {
      return '#6DB56D' // green
  }

  get subclassImage() {
    return get(this.subclassImageMap, `[${this.node.subclass}]`)
  }
}
