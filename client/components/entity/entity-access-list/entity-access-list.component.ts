import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'entity-access-list',
    template: require('./entity-access-list.html'),
    styles: [require('./entity-access-list.scss')],
})
export class EntityAccessListComponent implements OnInit {

    static parameters = [];
    constructor() {
    }

    ngOnInit() {
    }
}
