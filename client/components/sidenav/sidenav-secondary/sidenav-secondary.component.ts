import { Component, ViewChild, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
    selector: 'app-sidenav-secondary',
    template: require('./sidenav-secondary.html'),
    styles: [require('./sidenav-secondary.scss')]
})
export class SidenavSecondaryComponent implements OnInit, OnDestroy {

    static parameters = [];
    constructor() { }

    ngOnInit() { }

    ngOnDestroy() { }
}
