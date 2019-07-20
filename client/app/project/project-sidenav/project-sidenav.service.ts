import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { MatSidenav, MatDrawerToggleResult } from '@angular/material/sidenav';
import { ProjectSidenavItem } from './models/project-sidenav-item.model';
import { ProjectDataService, ProjectUserPermission } from '../project-data.service';

const enum itemTitles {
    DASHBOARD = 'Dashboard',
    INSIGHTS = 'Insights',
    RESOURCES = 'Resources',
    DISCUSSION = 'Discussion',
    SETTINGS = 'Settings'
}

@Injectable()
export class ProjectSidenavService implements OnInit, OnDestroy {
    private _opened: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    private _mode: BehaviorSubject<string> = new BehaviorSubject<string>('side');
    private _items: BehaviorSubject<ProjectSidenavItem[]> = new BehaviorSubject<ProjectSidenavItem[]>([{
        title: itemTitles.DISCUSSION,
        icon: 'dashboard',
        routerLink: ['dashboard'],
        routerLinkActiveOptions: {},
        visible: true
    }, {
        title: itemTitles.INSIGHTS,
        icon: 'layers',
        routerLink: ['insights'],
        routerLinkActiveOptions: {},
        visible: true
    }, {
        title: itemTitles.RESOURCES,
        icon: 'list',
        routerLink: ['resources'],
        routerLinkActiveOptions: {},
        visible: true
    }, {
        title: itemTitles.DISCUSSION,
        icon: 'forum',
        routerLink: ['discussion'],
        routerLinkActiveOptions: {},
        visible: true
    }, {
        title: itemTitles.SETTINGS,
        icon: 'settings',
        routerLink: ['settings'],
        routerLinkActiveOptions: {},
        visible: false
    }]);

    static parameters = [ProjectDataService];
    constructor(private projectDataService: ProjectDataService) {
      this.projectDataService.userPermission()
          .subscribe(userPermission => {
              console.log('USER PERMISSION', userPermission);
              let items = this._items.getValue();
              items.find(item => item.title === itemTitles.SETTINGS).visible = userPermission.canAdmin;
              this._items.next(items);
          });
    }

    ngOnInit() {
        // this.projectDataService.userPermission()
        //     .subscribe(userPermission => {
        //         console.log('USER PERMISSION', userPermission);
        //         let items = this._items.getValue();
        //         items.find(item => item.title === itemTitles.SETTINGS).visible = userPermission.canAdmin;
        //         this._items.next(items);
        //     });
    }

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
