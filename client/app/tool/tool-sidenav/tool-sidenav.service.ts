import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { MatSidenav, MatDrawerToggleResult } from '@angular/material/sidenav';
import { ToolSidenavItem } from './models/tool-sidenav-item.model';
import { ToolDataService } from '../tool-data.service';

const enum itemTitles {
    HOME = 'Home',
    DISCUSSION = 'Discussion',
    ACTIVITY = 'Activity',
    SETTINGS = 'Settings',
}

@Injectable()
export class ToolSidenavService implements OnDestroy {
    private _opened: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    private _mode: BehaviorSubject<string> = new BehaviorSubject<string>('side');
    private _items: BehaviorSubject<ToolSidenavItem[]> = new BehaviorSubject<ToolSidenavItem[]>([
        {
            title: itemTitles.HOME,
            icon: 'dashboard',
            routerLink: ['home'],
            routerLinkActiveOptions: {},
            visible: true,
        },
        {
            title: itemTitles.DISCUSSION,
            icon: 'forum',
            routerLink: ['discussion'],
            routerLinkActiveOptions: {},
            visible: true,
        },
        {
            title: itemTitles.ACTIVITY,
            icon: 'bubble_chart',
            routerLink: ['activities'],
            routerLinkActiveOptions: {},
            visible: true,
        },
        {
            title: itemTitles.SETTINGS,
            icon: 'settings',
            routerLink: ['settings'],
            routerLinkActiveOptions: {},
            visible: false,
        },
    ]);

    static parameters = [ToolDataService];
    constructor(private toolDataService: ToolDataService) {
        this.toolDataService.userPermission().subscribe(userPermission => {
            let items = this._items.getValue();
            items.find(item => item.title === itemTitles.SETTINGS).visible = userPermission.canAdmin;
            this._items.next(items);
        });
    }

    ngOnDestroy() {}

    opened(): Observable<boolean> {
        return this._opened.asObservable();
    }

    mode(): Observable<string> {
        return this._mode.asObservable();
    }

    items(): Observable<ToolSidenavItem[]> {
        return this._items.asObservable();
    }
}
