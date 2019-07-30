import { Node } from './';

export class Link implements d3.SimulationLinkDatum<Node> {
    // optional - defining optional implementation properties - required for relevant typing assistance
    index?: number;

    // must - defining enforced implementation properties
    source: Node;
    target: Node;
    link: Node;

    constructor(source, target, link) {
        this.source = source;
        this.target = target;
        this.link = link;
    }
}
