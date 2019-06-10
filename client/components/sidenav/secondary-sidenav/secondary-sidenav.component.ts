import { Component, ViewChild, OnDestroy, ComponentFactoryResolver, Type } from '@angular/core';
import { SidenavHostDirective } from '../sidenav-host.directive';

@Component({
    selector: 'app-secondary-sidenav',
    template: require('./secondary-sidenav.html'),
    styles: [require('./secondary-sidenav.scss')]
})
export class SecondarySidenavComponent implements OnDestroy {
    @ViewChild(SidenavHostDirective) private sidenavHost: SidenavHostDirective;
    private contentId: string;

    static parameters = [ComponentFactoryResolver];
    constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

    ngOnDestroy() { }

    getContentId(): string {
        return this.contentId;
    }

    setContentId(contentId: string) {
        this.contentId = contentId;
    }

    loadComponent(component: Type<any>): any {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
        let viewContainerRef = this.sidenavHost.viewContainerRef;
        viewContainerRef.clear();
        let componentRef = viewContainerRef.createComponent(componentFactory);
        return componentRef.instance;
    }
}
