import { get } from 'lodash'

enum NodeLabel {
    Activity = 'Activity',
    Reference = 'Reference',
    Agent = 'Agent',
}

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

    r = 25

    constructor(id: string, label: string, nodeClass: string, subclass: string) {
        this.id = id;
        this.label = NodeLabel[label];
        this.nodeClass = nodeClass;
        this.subclass = subclass;
    }
}
