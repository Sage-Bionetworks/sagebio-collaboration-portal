import { Component, Input } from '@angular/core';
import { Node } from '../../../d3/models/node';

@Component({
    selector: '[activityNode]',
    template: require('./activity-node.html'),
    styles: [require('./activity-node.scss')]
})
export class ActivityNodeComponent {
    @Input('activityNode') node: Node;
}
