import { Injectable, TemplateRef, Type } from '@angular/core';
import { MatSidenav, MatDrawerToggleResult } from '@angular/material/sidenav';
import { Observable, BehaviorSubject } from 'rxjs';
import { SecondarySidenavComponent } from './secondary-sidenav.component';

@Injectable()
export class SecondarySidenavService {
    public sidenav: MatSidenav;
    public sidenavContent: SecondarySidenavComponent;

    static parameters = [];
    constructor() { }

    public close(): Promise<MatDrawerToggleResult> {
        return this.sidenav.close();
    }

    public open(): Promise<MatDrawerToggleResult> {
        return this.sidenav.open();
    }

    public toggle(): Promise<MatDrawerToggleResult> {
        return this.sidenav.toggle();
    }

    public getContentId(): string {
        return this.sidenavContent.getContentId();
    }

    public setContentId(contentId: string) {
        this.sidenavContent.setContentId(contentId);
    }

    public loadContentComponent(component: Type<any>): any {
        return this.sidenavContent.loadContentComponent(component);
    }

    public destroyContentComponent(): void {
        this.sidenavContent.destroyContentComponent();
    }
}
