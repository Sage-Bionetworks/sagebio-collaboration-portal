import { Component } from '@angular/core';
import { ProvenanceNodeComponent } from '../provenance-node/provenance-node.component';
import { get } from 'lodash';

@Component({
    selector: '[activityNode]',
    template: require('./activity-node.html'),
    styles: [require('./activity-node.scss')]
})
export class ActivityNodeComponent extends ProvenanceNodeComponent {
  private classIconMap = {
    'ToolSession': this.iconDictionary.gears,
    'Mention': this.iconDictionary.at,
    'MemoCreation': this.iconDictionary.stickyNote,
    'ReportCreation': this.iconDictionary.edit,
    'Starred': this.iconDictionary.star,
    'ResourceRegistration': this.iconDictionary.link,
  };

  get icon() {
    return get(this.classIconMap, `[${this.node.nodeClass}]`, '');
  }

  get color() {
    return this.colorDictionary.blue;
  }
}
