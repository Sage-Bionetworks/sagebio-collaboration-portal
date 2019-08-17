import { Component, Input } from '@angular/core';
import { Link } from '../../../d3/models/link';
import * as d3 from 'd3';

@Component({
    selector: '[provenanceLink]',
    template: require('./provenance-link.html'),
    styles: [require('./provenance-link.scss')]
})
export class ProvenanceLinkComponent {
    @Input('provenanceLink') link: Link;

    get rotateLabel() {
        const edgelabel = d3.select(`#edgelabel-${this.link.index}`).node() as any;
        if (edgelabel && (this.link.target.x < this.link.source.x)) {
            const dimensions = edgelabel.getBBox();

            const rx = dimensions.x + dimensions.width / 2;
            const ry = dimensions.y + dimensions.height / 2;
            return 'rotate(180 ' + rx + ' ' + ry + ')';
        } else {
            return 'rotate(0)';
        }
    }
}
