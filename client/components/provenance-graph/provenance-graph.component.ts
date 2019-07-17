import { Component, Input, ViewChild, OnInit, ViewEncapsulation } from '@angular/core';
import customNeo4jd3 from '../d3/models/custom-neo-4jd3';
import { ProvenanceSidenavComponent } from './provenance-sidenav/provenance-sidenav.component'

@Component({
    selector: 'provenance-graph',
    template: require('./provenance-graph.html'),
    styles: [require('./provenance-graph.scss')],
    encapsulation: ViewEncapsulation.None,
})
export class ProvenanceGraphComponent implements OnInit {
    @Input() nodes: Object;
    private contentDetails: Object

    @ViewChild(ProvenanceSidenavComponent, { static: false }) provenanceSidenavComponent: ProvenanceSidenavComponent;

    constructor() {}
    ngOnInit() {
        customNeo4jd3('.customNeo4jd3', this.getGraphOptions(this.nodes));
    }

    getGraphOptions(nodesToGraph: Object) {
        return {
            icons: {
                'Activity|_class|Tool session': 'cogs',
                'Activity|_class|Mention': 'at',
                'Activity|_class|Memoization': 'sticky-note',
                'Activity|_class|Report generation': 'edit',
                'Activity|_class|Starred': 'star',
                'Agent': 'user',
                'Reference|_class|Insight': 'lightbulb-o',
                'Reference|_class|Resource': 'cube',
                'Reference|_class|Tool': 'cog',
                'Reference|_class|Message': 'comment'
            },
            images: {
                'Reference|subclass|File': 'assets/images/provenence-graph/1f4c4.svg',
                'Reference|subclass|State': 'assets/images/provenence-graph/1f4be.svg',
                'Reference|subclass|Dashboard': 'assets/images/provenence-graph/1f39b.svg',
                'Reference|subclass|App': 'assets/images/provenence-graph/1f4bb.svg',
                'Reference|subclass|Notebook': 'assets/images/provenence-graph/1f4ca.svg',
                'Reference|subclass|Protocol': 'assets/images/provenence-graph/2697.svg',
                'Reference|subclass|Report': 'assets/images/provenence-graph/1f4cb.svg',
                'Reference|subclass|Memo': 'assets/images/provenence-graph/1f516.svg',
                'Reference|subclass|Star': 'assets/images/provenence-graph/2b50.svg'
            },
            minCollision: 60,
            neo4jData: nodesToGraph,
            nodeRadius: 25,
            zoomFit: true,
            onNodeDoubleClick: (node: any) => {
                this.showDetailsInSideNav(node);
            },
            onRelationshipDoubleClick: function(relationship: any) {
                console.log('double click on relationship line: // bind // trigger action', relationship);
            },
            onNodeMouseEnter: function(node: any) {
                console.log('hovering a node: // bind // trigger action', node);
            },
        }
    }

    showDetailsInSideNav(node: any): void {
        this.contentDetails = node;
    }

    ngAfterViewInit() { }
}