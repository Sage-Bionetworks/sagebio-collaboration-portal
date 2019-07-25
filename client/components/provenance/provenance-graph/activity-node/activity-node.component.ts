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
    'Tool session': '&#xf085', // gears,cogs
    'Mention': '&#xf1fa', // at
    'Memoization': '&#xf249', // sticky-note
    'Report generation': '&#xf044', // edit,pencil-square-o
    'Starred': '&#xf005', // star
  }

  get icon() {
    return get(this.classIconMap, `[${this.node.nodeClass}]`, '')
  }

  get color() {
    return '#679EC1' // blue
  }
}
