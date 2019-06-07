import { Injectable, TemplateRef } from '@angular/core';
import { MatSidenav, MatDrawerToggleResult } from '@angular/material/sidenav';
import { Observable, BehaviorSubject } from 'rxjs';
import { SidenavSecondaryComponent } from './sidenav-secondary/sidenav-secondary.component';
import { SidenavItem } from './sidenav-item';

@Injectable()
export class SidenavService {
    public sidenav: MatSidenav;
    public sidenavContent: SidenavSecondaryComponent;

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

    public show(sidenavItem: SidenavItem) {
        this.sidenavContent.loadComponent(sidenavItem);
        this.open();
    }

    // public setSidenavContent() {
    //
    // }

    // public setInstanceItems(items: SidenavItem[]): void {
    //     this._instanceItems.next(items);
    // }
    //
    // public getInstanceItems(): Observable<SidenavItem[]> {
    //     return this._instanceItems.asObservable();
    // }
}
