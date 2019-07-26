import { Component } from '@angular/core';
import { ProvenanceNodeComponent } from '../provenance-node/provenance-node.component';
import { get } from 'lodash'

@Component({
    selector: '[activityNode]',
    template: require('./activity-node.html'),
    styles: [require('./activity-node.scss')]
})
export class ActivityNodeComponent extends ProvenanceNodeComponent {
  private classIconMap = {
    'Tool session': this.iconDictionary.gears,
    'Mention': this.iconDictionary.at,
    'Memoization': this.iconDictionary.stickyNote,
    'Report generation': this.iconDictionary.edit,
    'Starred': this.iconDictionary.star,
  }

  get icon() {
    return get(this.classIconMap, `[${this.node.nodeClass}]`, '')
  }

  get color() {
    return this.colorDictionary.blue
  }
}
