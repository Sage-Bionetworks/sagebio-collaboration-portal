import { Component, ViewChild, ComponentFactoryResolver, Type } from '@angular/core';
import { SidenavHostDirective } from '../sidenav-host.directive';

@Component({
    selector: 'app-secondary-sidenav',
    template: require('./secondary-sidenav.html'),
    styles: [require('./secondary-sidenav.scss')]
})
export class SecondarySidenavComponent {
    @ViewChild(SidenavHostDirective) private sidenavHost: SidenavHostDirective;
    private contentId: string;  // used to track the component AND data loaded

    static parameters = [ComponentFactoryResolver];
    constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

    loadContentComponent(component: Type<any>): any {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
        let viewContainerRef = this.sidenavHost.viewContainerRef;
        viewContainerRef.clear();
        let componentRef = viewContainerRef.createComponent(componentFactory);
        return componentRef.instance;
    }

    destroyContentComponent(): void {
        this.sidenavHost.viewContainerRef.clear();
        this.contentId = undefined;
    }

    getContentId(): string {
        return this.contentId;
    }

    setContentId(contentId: string): void {
        this.contentId = contentId;
    }
}
