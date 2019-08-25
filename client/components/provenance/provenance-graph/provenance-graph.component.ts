import {
    Component,
    Input,
    ChangeDetectorRef,
    HostListener,
    ChangeDetectionStrategy,
    AfterViewInit,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { includes } from 'lodash';

import { ForceDirectedGraph, Node, Link } from '../../d3/models';
import { D3Service } from '../../d3/d3.service';
import { ProvenanceNode } from 'models/provenance/provenance-node.model';

@Component({
    selector: 'provenance-graph',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: require('./provenance-graph.html'),
    styles: [require('./provenance-graph.scss')]
})
export class ProvenanceGraphComponent implements AfterViewInit, OnChanges {
    @Input() graphData: any;
    @Input() rootId: string;
    nodes: Node[] = [];
    links: Link[];
    graph: ForceDirectedGraph;
    private _options: { width, height } = { width: 400, height: 300 };

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.graph.initSimulation(this.options);
    }

    static parameters = [D3Service, ChangeDetectorRef];
    constructor(private d3Service: D3Service, private ref: ChangeDetectorRef) { }

    ngAfterViewInit() {
        this.initGraph();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.initGraph();
        this.graph.simulation.tick(100);
    }

    initGraph() {
        if (this.graphData) {
            this.convertToD3(this.graphData);
            this.graph = this.d3Service.getForceDirectedGraph(this.nodes, this.links, this.options);
            /** Binding change detection check on each tick
             * This along with an onPush change detection strategy should enforce checking only when relevant!
            * This improves scripting computation duration in a couple of tests I've made, consistently.
            * Also, it makes sense to avoid unnecessary checks when we are dealing only with simulations data binding.
            */
            this.graph.ticker.subscribe((d) => {
                this.ref.markForCheck();
            });
        }
    }
    get options() {
        return this._options = {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }

    convertToD3(neojson) {
        var graph = {
            nodes: [],
            relationships: []
        };
        neojson.results.forEach(function (result) {
            result.data.forEach(function (data) {
                data.graph.nodes.forEach(function (node: ProvenanceNode) {
                    if (!includes(graph.nodes, node.id)) {
                        graph.nodes.push(new Node(
                            node.id,
                            node.labels[0],
                            node.properties.class,
                            node.properties.subclass,
                            node
                        ));
                    }
                });

                data.graph.relationships.forEach(function (relationship) {
                    relationship.source = relationship.startNode;
                    relationship.target = relationship.endNode;
                    graph.relationships.push(new Link(relationship.source, relationship.target, relationship));
                });

                data.graph.relationships.sort(function (a, b) {
                    if (a.source > b.source) {
                        return 1;
                    } else if (a.source < b.source) {
                        return -1;
                    } else {
                        if (a.target > b.target) {
                            return 1;
                        }

                        if (a.target < b.target) {
                            return -1;
                        } else {
                            return 0;
                        }
                    }
                });

                for (var i = 0; i < data.graph.relationships.length; i++) {
                    if (i !== 0
                        && data.graph.relationships[i].source === data.graph.relationships[i - 1].source
                        && data.graph.relationships[i].target === data.graph.relationships[i - 1].target) {
                        data.graph.relationships[i].linknum = data.graph.relationships[i - 1].linknum + 1;
                    } else {
                        data.graph.relationships[i].linknum = 1;
                    }
                }
            });
        });
        this.nodes = graph.nodes;
        this.links = graph.relationships;
    }
}
