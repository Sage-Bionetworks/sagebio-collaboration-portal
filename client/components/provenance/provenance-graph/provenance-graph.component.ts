import { Component, Input, ChangeDetectorRef, HostListener, ChangeDetectionStrategy, OnInit, AfterViewInit } from '@angular/core';
import { ForceDirectedGraph, Node } from '../../d3/models';
import { D3Service } from '../../d3/d3.service';
import { ActivityNodeComponent } from './activity-node/activity-node.component';
import { ProvenanceLinkComponent } from './provenance-link/provenance-link.component';

@Component({
    selector: 'provenance-graph',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: require('./provenance-graph.html'),
    styles: [require('./provenance-graph.scss')]
})
export class ProvenanceGraphComponent implements OnInit, AfterViewInit {
    @Input('nodes') nodes;
    @Input('links') links;
    graph: ForceDirectedGraph;
    private _options: { width, height } = { width: 400, height: 300 };

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.graph.initSimulation(this.options);
    }

    static parameters = [D3Service, ChangeDetectorRef];
    constructor(private d3Service: D3Service, private ref: ChangeDetectorRef) { }

    ngOnInit() {
        /** Receiving an initialized simulated graph from our custom d3 service */
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

    ngAfterViewInit() {
        this.graph.initSimulation(this.options);
    }

    get options() {
        return this._options = {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }
}
