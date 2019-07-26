import { Component } from '@angular/core';
import { ProvenanceNodeComponent } from '../provenance-node/provenance-node.component';

@Component({
    selector: '[agentNode]',
    template: require('./agent-node.html'),
    styles: [require('./agent-node.scss')]
})
export class AgentNodeComponent extends ProvenanceNodeComponent {
  get icon() {
    return this.iconDictionary.user
  }

  get color() {
      return this.colorDictionary.orange
  }
}
