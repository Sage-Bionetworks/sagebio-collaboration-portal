import { Component, ViewChild, OnInit, OnDestroy, TemplateRef } from '@angular/core';

@Component({
    selector: 'app-sidenav-secondary',
    template: require('./sidenav-secondary.html'),
    styles: [require('./sidenav-secondary.scss')]
})
export class SidenavSecondaryComponent implements OnInit, OnDestroy {
    private template: TemplateRef<any>;
    // @ContentChild

    static parameters = [];
    constructor() { }

    ngOnInit() { }

    ngOnDestroy() { }

    public setTemplate(template: TemplateRef<any>): void {
        this.template = template;
    }
}
