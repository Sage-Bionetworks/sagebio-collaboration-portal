import { Component, ViewChild, OnInit, OnDestroy, TemplateRef, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { SidenavHostDirective } from '../sidenav-host.directive';
import { SidenavItem } from '../sidenav-item';
import { AppSidenav } from '../sidenav.model';

@Component({
    selector: 'app-sidenav-secondary',
    template: require('./sidenav-secondary.html'),
    styles: [require('./sidenav-secondary.scss')]
})
export class SidenavSecondaryComponent implements OnInit, OnDestroy {
    @ViewChild(SidenavHostDirective) private sidenavHost: SidenavHostDirective;

    static parameters = [ComponentFactoryResolver];
    constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

    ngOnInit() { }

    ngOnDestroy() { }

    getSidenavHost(): SidenavHostDirective {
        return this.sidenavHost;
    }

    // loadComponent(sidenavItem: SidenavItem) {
    //     let componentFactory = this.componentFactoryResolver.resolveComponentFactory(sidenavItem.component);
    //
    //     let viewContainerRef = this.sidenavHost.viewContainerRef;
    //     viewContainerRef.clear();
    //
    //     let componentRef = viewContainerRef.createComponent(componentFactory);
    //     (<AppSidenav>componentRef.instance).data = sidenavItem.data;
    // }
}
