import { Component, Input } from '@angular/core';
import { Node } from '../../../d3/models/node';

@Component({
    selector: '[provenanceNode]',
    template: require('./provenance-node.html'),
    styles: [require('./provenance-node.scss')]
})
export class ProvenanceNodeComponent {
    @Input() node: Node;

    iconDictionary = {
        gear: '&#xf013',
        gears: '&#xf085',
        at: '&#xf1fa',
        stickyNote: '&#xf249',
        edit: '&#xf044',
        star: '&#xf005',
        user: '&#xf007',
        lightbulb: '&#xf0eb',
        cube: '&#xf1b2',
        comment: '&#xf075',
    }

    colorDictionary = {
        blue: '#679EC1',
        orange: '#EB8231',
        green: '#6DB56D',
    }

    get r() {
        return this.node.r;
    }

    get fontSize() {
        return '25px';
    }
}
