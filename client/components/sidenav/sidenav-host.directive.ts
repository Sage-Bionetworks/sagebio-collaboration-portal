import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[sidenav-host]',
})
export class SidenavHostDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}
