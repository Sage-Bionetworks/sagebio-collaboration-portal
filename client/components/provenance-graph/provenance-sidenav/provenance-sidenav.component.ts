import { Component, Input, Output,OnDestroy, EventEmitter } from '@angular/core';

@Component({
    selector: 'provenance-sidenav',
    template: require('./provenance-sidenav.html'),
    styles: [require('./provenance-sidenav.scss')]
})

export class ProvenanceSidenavComponent implements OnDestroy {
    @Input() contentDetails: any;
    @Output() close: EventEmitter<any> = new EventEmitter<any>();

    ngOnDestroy() {
    }
}
