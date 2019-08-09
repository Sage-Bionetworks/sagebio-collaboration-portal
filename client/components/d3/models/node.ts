import { NodeLabel, ProvenanceNode } from 'models/provenance-node.model';

export class Node implements d3.SimulationNodeDatum {
    index?: number;
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
    fx?: number | null;
    fy?: number | null;

    id: string;
    label: NodeLabel;
    nodeClass: string;
    subclass: string;
    provenanceNode: ProvenanceNode;

    r = 25;

    constructor(id: string, label: string, nodeClass: string, subclass: string, provenanceNode: ProvenanceNode) {
        this.id = id;
        this.label = NodeLabel[label];
        this.nodeClass = nodeClass;
        this.subclass = subclass;
        this.provenanceNode = provenanceNode;
    }
}
