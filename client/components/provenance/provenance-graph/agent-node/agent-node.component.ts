import { Component } from '@angular/core';
import { ProvenanceNodeComponent } from '../provenance-node/provenance-node.component';

@Component({
    selector: '[agentNode]',
    template: require('./agent-node.html'),
    styles: [require('./agent-node.scss')]
})
export class AgentNodeComponent extends ProvenanceNodeComponent {
  get icon() {
    return '&#xf007' // user
  }

  get color() {
      return '#EB8231' // orange
  }
}
