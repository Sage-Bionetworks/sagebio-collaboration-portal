import { get } from 'lodash'

enum NodeLabel {
    Activity = 'Activity',
    Reference = 'Reference',
    Agent = 'Agent',
}

enum NodeClass {

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

    activityColorsMap = {
        Activity: '#679EC1', // blue
        Reference: '#6DB56D', // green
        Agent: '#EB8231', // orange
    }

    // { Label: { class: icon } }
    classIconMap = {
        Activity: {
            'Tool session': '&#xf085', // gears,cogs
            'Mention': '&#xf1fa', // at
            'Memoization': '&#xf249', // sticky-note
            'Report generation': '&#xf044', // edit,pencil-square-o
            'Starred': '&#xf005', // star
        },
        Agent: {
            'none': '&#xf007', // user
        },
        Reference: {
            'Insight': '&#xf0eb', // lightbulb-o
            'Resource': '&#xf1b2', // cube
            'Tool': '&#xf013', // gear,cog
            'Message': '&#xf075', // comment
        }
    }

    subclassImageMap = {
        File: 'assets/images/provenence-graph/1f4c4.svg',
        State: 'assets/images/provenence-graph/1f4be.svg',
        Dashboard: 'assets/images/provenence-graph/1f39b.svg',
        App: 'assets/images/provenence-graph/1f4bb.svg',
        Notebook: 'assets/images/provenence-graph/1f4ca.svg',
        Protocol: 'assets/images/provenence-graph/2697.svg',
        Report: 'assets/images/provenence-graph/1f4cb.svg',
        Memo: 'assets/images/provenence-graph/1f516.svg',
        Star: 'assets/images/provenence-graph/2b50.svg'
    }

    constructor(id: string, label: string, nodeClass: string = 'none', subclass: string) {
        this.id = id;
        this.label = NodeLabel[label];
        this.nodeClass = nodeClass;
        this.subclass = subclass;
    }

    get r() {
        return 25;
    }

    get fontSize() {
        return '25px';
    }

    get subclassImage() {
        return get(this.subclassImageMap, `[${this.subclass}]`)
    }

    get icon() {
        return get(this.classIconMap, `[${this.label}][${this.nodeClass}]`, '')
    }

    get color() {
        return get(this.activityColorsMap, `[${this.label}]`, '');
    }
}
