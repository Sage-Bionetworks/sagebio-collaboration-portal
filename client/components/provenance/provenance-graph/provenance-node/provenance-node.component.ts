import { Component, Input, OnInit } from '@angular/core';
import { Node } from '../../../d3/models/node';
import * as d3 from 'd3';
import { get } from 'lodash';

@Component({
    selector: '[provenanceNode]',
    template: require('./provenance-node.html'),
    styles: [require('./provenance-node.scss')]
})
export class ProvenanceNodeComponent implements OnInit {
    @Input() node: Node;
    @Input() rootId: string;

    ngOnInit() {
        this.createTooltipElement();
    }

    createTooltipElement() {
        d3.select('.provenance-graph')
            .append('div')
            .classed(`tooltip tooltip-${this.node.id}`, true)
            .style('opacity', 0);
    }

    getTooltipContent() {
        const { label, nodeClass, subclass, provenanceNode } = this.node

        const typeText = nodeClass ? `<strong>Type: </strong>${nodeClass}` : ''
        const subtypeText = subclass && subclass !== nodeClass ? `<br>Subtype: ${subclass}` : ''

        return `
            <div><strong>${label}: </strong>${get(provenanceNode, 'properties.name')}</div>
            <div>
                <span>
                    ${typeText}
                    ${subtypeText}
                </span>
            </div>
        `;
    }

    handleMouseMove(event: MouseEvent) {
        const tooltipElement = d3.select(`.tooltip-${this.node.id}`);
        const dimensions = (tooltipElement as any).node().getBoundingClientRect();
        tooltipElement
            .html(this.getTooltipContent())
            .style('left', event.clientX - dimensions.width / 2 + 'px')
            .style('top', event.clientY - (dimensions.height + 25) + 'px')
            .transition()
            .duration(200)
            .style('opacity', 1);
    }

    handleMouseLeave() {
        d3.select(`.tooltip-${this.node.id}`)
            .transition()
            .duration(200)
            .style('opacity', 0);
    }

    iconDictionary = {
        gear: '&#xf013',
        gears: '&#xf085',
        at: '&#xf1fa',
        stickyNote: '&#xf249',
        edit: '&#xf044',
        star: '&#xf005',
        user: '&#xf007',
        lightbulb: '&#xf0eb',
        cube: '&#xf1b2',
        comment: '&#xf075',
    };

    colorDictionary = {
        blue: '#679EC1',
        orange: '#EB8231',
        green: '#6DB56D',
    };

    get r() {
        return this.node.r;
    }

    get fontSize() {
        return '25px';
    }

    get isHighlighted() {
        return (
            get(this.node.provenanceNode, 'properties.targetId') === this.rootId ||
            get(this.node.provenanceNode, 'properties.userId') === this.rootId
        )
    }
}
