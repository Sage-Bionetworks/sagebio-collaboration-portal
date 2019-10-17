import { Component } from '@angular/core';
import { ProvenanceNodeComponent } from '../provenance-node/provenance-node.component';
import { get } from 'lodash';

@Component({
    selector: '[referenceNode]',
    template: require('./reference-node.html'),
    styles: [require('./reference-node.scss')]
})
export class ReferenceNodeComponent extends ProvenanceNodeComponent {
  private classIconMap = {
    'Project': this.iconDictionary.suitcase,
    'Insight': this.iconDictionary.lightbulb,
    'Resource': this.iconDictionary.cube,
    'Tool': this.iconDictionary.gear,
    'Message': this.iconDictionary.comment,
  };

  subclassImageMap = {
    File: 'assets/images/provenence-graph/file.svg',
    State: 'assets/images/provenence-graph/state.svg',
    Dashboard: 'assets/images/provenence-graph/dashboard.svg',
    App: 'assets/images/provenence-graph/app.svg',
    Notebook: 'assets/images/provenence-graph/notebook.svg',
    Protocol: 'assets/images/provenence-graph/protocol.svg',
    Report: 'assets/images/provenence-graph/report.svg',
    Memo: 'assets/images/provenence-graph/memo.svg',
    Star: 'assets/images/provenence-graph/star.svg'
  };

  get icon() {
      return get(this.classIconMap, `[${this.node.nodeClass}]`);
  }

  get color() {
      if (this.node.nodeClass === 'Project') {
          return this.colorDictionary.gray;
      } else {
          return this.colorDictionary.green;
      }
  }

  get subclassImage() {
    return get(this.subclassImageMap, `[${this.node.subclass}]`);
  }
}
