import { Injectable } from '@angular/core';
import { MatSidenav, MatDrawerToggleResult } from '@angular/material/sidenav';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class SidenavService {
    public sidenav: MatSidenav;

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

    // public setInstanceItems(items: SidenavItem[]): void {
    //     this._instanceItems.next(items);
    // }
    //
    // public getInstanceItems(): Observable<SidenavItem[]> {
    //     return this._instanceItems.asObservable();
    // }
}
