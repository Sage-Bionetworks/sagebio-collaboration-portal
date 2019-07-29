import { Component, OnInit, Input, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';
import { Entity } from 'models/entities/entity.model';
import { User } from 'models/auth/user.model';

@Component({
    selector: 'show-activity-button',
    template: require('./show-activity-button.html'),
    styles: [require('./show-activity-button.scss')],
    encapsulation: ViewEncapsulation.None
})
export class ShowActivityButtonComponent implements OnInit {
    @Input() private root: Entity | User;
    @Output() click: EventEmitter<any> = new EventEmitter<any>();

    static parameters = [SecondarySidenavService];
    constructor(
        private sidenavService: SecondarySidenavService) { }

    ngOnInit() { }

    ngOnDestroy() { }

}
