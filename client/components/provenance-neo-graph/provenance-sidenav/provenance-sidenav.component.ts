import { Component, Input, OnDestroy, EventEmitter } from '@angular/core';
import { get } from 'lodash'

@Component({
    selector: 'provenance-sidenav',
    template: require('./provenance-sidenav.html'),
    styles: [require('./provenance-sidenav.scss')]
})

export class ProvenanceSidenavComponent implements OnDestroy {
    @Input() contentDetails: any;

    get = get

    ngOnDestroy() {
    }
}
