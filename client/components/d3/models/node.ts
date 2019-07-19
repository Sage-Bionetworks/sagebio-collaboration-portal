export class Node implements d3.SimulationNodeDatum {
    // optional - defining optional implementation properties - required for relevant typing assistance
    index?: number;
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
    fx?: number | null;
    fy?: number | null;

    id: any;
    node: any;
    nodesLength: any;

    // linkCount = 0;

    numClasses = 0
    classes2colors = {}

    // TODO: Create a provenance node model that extends this class
    // TODO: Keep here only the most basic code that describe a node (see Link)
    D3_CONFIG = {
        COLORS: [
            '#679EC1', // sage blue
            '#6DB56D', // sage green
            '#EB8231', // sage orange
            '#405f9e', // navy blue
            '#ffab1a', // dark orange
            '#78cecb', // green #2,
            '#fcea7e', // light yellow
            '#68bdf6', // light blue
            '#6dce9e', // green #1
            '#faafc2', // light pink
            '#f2baf6', // purple
            '#ff928c', // light red
            '#ffc766', // light orange
            '#a5abb6', // dark gray
            '#b88cbb', // dark purple
            '#ced2d9', // light gray
            '#e84646', // dark red
            '#fa5f86', // dark pink
            '#fcda19', // dark yellow
            '#797b80', // black
            '#c9d96f', // pistacchio
            '#47991f', // green #3
            '#70edee', // turquoise
            '#ff75ea'  // pink
        ]
    };

    constructor(node: any, nodesLength: number) {
        this.node = node;
        this.id = node.id
        this.nodesLength = nodesLength;
    }

    normal = () => {
        // return Math.sqrt(this.id / this.D3_CONFIG.N);
        // return Math.sqrt(this.id / this.nodesLength);
        return 1;
    }

    get r() {
        return 50 * this.normal() + 10;
    }

    get fontSize() {
        // return (30 * this.normal() + 10) + 'px';
        return '40 px';
    }

    get color() {
        // let index = Math.floor(this.D3_CONFIG.COLORS.length * this.normal());
        // return this.D3_CONFIG.COLORS[index];
        if (this.node) {
            const label = this.node.labels[0]
            var color = this.classes2colors[label];
            if (!color) {
                color = this.D3_CONFIG.COLORS[this.numClasses % this.D3_CONFIG.COLORS.length];
                this.classes2colors[label] = color;
                this.numClasses++;
            }

            return color;
        }

    }
}
