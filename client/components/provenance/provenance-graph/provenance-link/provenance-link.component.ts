import { Component, Input } from '@angular/core';
import { Link } from '../../../d3/models/link';

@Component({
    selector: '[provenanceLink]',
    template: require('./provenance-link.html'),
    styles: [require('./provenance-link.scss')]
})
export class ProvenanceLinkComponent {
    @Input('provenanceLink') link: Link;
}
