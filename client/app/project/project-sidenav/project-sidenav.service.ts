import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { MatSidenav, MatDrawerToggleResult } from '@angular/material/sidenav';
import { ProjectSidenavItem } from './models/project-sidenav-item.model';

@Injectable()
export class ProjectSidenavService implements OnDestroy {
    private _opened: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    private _mode: BehaviorSubject<string> = new BehaviorSubject<string>('side');
    private _items: BehaviorSubject<ProjectSidenavItem[]> = new BehaviorSubject<ProjectSidenavItem[]>([{
        title: 'Dashboard',
        icon: 'dashboard',
        routerLink: ['dashboard'],
        routerLinkActiveOptions: {},
        visible: true
    }, {
        title: 'Insights',
        icon: 'layers',
        routerLink: ['insights'],
        routerLinkActiveOptions: {},
        visible: true
    }, {
        title: 'Resources',
        icon: 'list',
        routerLink: ['resources'],
        routerLinkActiveOptions: {},
        visible: true
    }, {
        title: 'Discussion',
        icon: 'forum',
        routerLink: ['discussion'],
        routerLinkActiveOptions: {},
        visible: true
    }, {
        title: 'Settings',
        icon: 'settings',
        routerLink: ['settings'],
        routerLinkActiveOptions: {},
        visible: true
    }]);

    static parameters = [];
    constructor() { }

    ngOnDestroy() {
        // this.updateItemsSub.unsubscribe();
        // this.updateAppSidenavSub.unsubscribe();
        // this.sidenavService.setInstanceItems([]);
    }

    opened(): Observable<boolean> {
        return this._opened.asObservable();
    }

    mode(): Observable<string> {
        return this._mode.asObservable();
    }

    items(): Observable<ProjectSidenavItem[]> {
        return this._items.asObservable();
    }

    // public close(): Promise<MatDrawerToggleResult> {
    //     return this.sidenav.close();
    // }
    //
    // public open(): Promise<MatDrawerToggleResult> {
    //     return this.sidenav.open();
    // }
    //
    // public toggle(): Promise<MatDrawerToggleResult> {
    //     return this.sidenav.toggle();
    // }
    //
    // public getItems(): Observable<SidenavItem[]> {
    //     return this._items.asObservable();
    // }
}
