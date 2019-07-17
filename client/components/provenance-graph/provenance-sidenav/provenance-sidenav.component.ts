import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'provenance-sidenav',
    template: require('./provenance-sidenav.html'),
    styles: [require('./provenance-sidenav.scss')]
})

export class ProvenanceSidenavComponent implements OnDestroy {
    @Input() contentDetails: Object;
    private content: Object;
    private name: String;
    private id: String;
    @Output() close: EventEmitter<any> = new EventEmitter<any>();

    OnInit() {
        if (this.contentDetails) {
            this.content = JSON.stringify(this.contentDetails)
            this.contentId =  this.contentDetails.id
        }
    }

    ngOnDestroy() {
    }
}
