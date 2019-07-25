import { Component, Input } from '@angular/core';
import { Node } from '../../../d3/models/node';

@Component({
    selector: '[provenanceNode]',
    template: require('./provenance-node.html'),
    styles: [require('./provenance-node.scss')]
})
export class ProvenanceNodeComponent {
    @Input() node: Node;
    
    get r() {
        return this.node.r;
    }

    get fontSize() {
        return '25px';
    }
}
