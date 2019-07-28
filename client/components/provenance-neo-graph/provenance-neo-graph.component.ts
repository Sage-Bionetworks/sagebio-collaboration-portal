import { Component, Input, ViewChild, OnInit, ViewEncapsulation } from '@angular/core';
import customNeo4jd3 from '../d3/models/custom-neo-4jd3';
import { ProvenanceSidenavComponent } from './provenance-sidenav/provenance-sidenav.component'

@Component({
    selector: 'provenance-neo-graph',
    template: require('./provenance-neo-graph.html'),
    styles: [require('./provenance-neo-graph.scss')],
    encapsulation: ViewEncapsulation.None,
})
export class ProvenanceNeoGraphComponent implements OnInit {
    @Input() graphNodes: Object;
    private contentDetails: Object

    @ViewChild(ProvenanceSidenavComponent, { static: false }) provenanceSidenavComponent: ProvenanceSidenavComponent;

    constructor() {}
    ngOnInit() {
        customNeo4jd3('.customNeo4jd3', this.getGraphOptions(this.graphNodes));
    }

    getGraphOptions(graphNodes: Object) {
        return {
            icons: {
                'Activity|class|Tool session': 'cogs',
                'Activity|class|Mention': 'at',
                'Activity|class|Memoization': 'sticky-note',
                'Activity|class|Report generation': 'edit',
                'Activity|class|Starred': 'star',
                'Agent': 'user',
                'Reference|class|Insight': 'lightbulb-o',
                'Reference|class|Resource': 'cube',
                'Reference|class|Tool': 'cog',
                'Reference|class|Message': 'comment'
            },
            images: {
                'Reference|subclass|File': 'assets/images/provenence-graph/filesvg',
                'Reference|subclass|State': 'assets/images/provenence-graph/state.svg',
                'Reference|subclass|Dashboard': 'assets/images/provenence-graph/dashboard.svg',
                'Reference|subclass|App': 'assets/images/provenence-graph/app.svg',
                'Reference|subclass|Notebook': 'assets/images/provenence-graph/notebook.svg',
                'Reference|subclass|Protocol': 'assets/images/provenence-graph/protocol.svg',
                'Reference|subclass|Report': 'assets/images/provenence-graph/report.svg',
                'Reference|subclass|Memo': 'assets/images/provenence-graph/memo.svg',
                'Reference|subclass|Star': 'assets/images/provenence-graph/star.svg'
            },
            minCollision: 60,
            neo4jData: graphNodes,
            nodeRadius: 25,
            zoomFit: true,
            onNodeDoubleClick: (node: any) => {
                console.log('double click on node line: // bind // trigger action', node);
            },
            onRelationshipDoubleClick: (relationship: any) => {
                console.log('double click on relationship line: // bind // trigger action', relationship);
            },
            onNodeMouseEnter: (node: any) => {
                this.showDetailsInSideNav(node);
            },
        }
    }

    showDetailsInSideNav(node: any): void {
        this.contentDetails = node;
    }

    ngAfterViewInit() { }
}