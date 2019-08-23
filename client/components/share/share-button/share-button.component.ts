import { Component, OnInit, Input, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';
import { Entity } from 'models/entities/entity.model';

@Component({
    selector: 'share-button',
    template: require('./share-button.html'),
    styles: [require('./share-button.scss')],
    encapsulation: ViewEncapsulation.None,
})
export class ShareButtonComponent implements OnInit {
    @Input() private entity: Entity;
    @Output() click: EventEmitter<any> = new EventEmitter<any>();

    static parameters = [SecondarySidenavService];
    constructor(private sidenavService: SecondarySidenavService) {}

    ngOnInit() {}

    ngOnDestroy() {}
}
