import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { MatSidenav, MatDrawerToggleResult } from '@angular/material/sidenav';
import { ProjectSidenavItem } from './models/project-sidenav-item.model';
import { ProjectDataService } from '../project-data.service';

const enum itemTitles {
    HOME = 'Home',
    INSIGHTS = 'Insights',
    RESOURCES = 'Resources',
    DISCUSSION = 'Discussion',
    ACTIVITY = 'Activity',
    SETTINGS = 'Settings'
}

@Injectable()
export class ProjectSidenavService implements OnDestroy {
    private _opened: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    private _mode: BehaviorSubject<string> = new BehaviorSubject<string>('side');
    private _items: BehaviorSubject<ProjectSidenavItem[]> = new BehaviorSubject<ProjectSidenavItem[]>([{
        title: itemTitles.HOME,
        icon: 'dashboard',
        routerLink: ['home'],
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
        title: itemTitles.ACTIVITY,
        icon: 'bubble_chart',
        routerLink: ['activity'],
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
              let items = this._items.getValue();
              items.find(item => item.title === itemTitles.SETTINGS).visible = userPermission.canAdmin;
              this._items.next(items);
          });
    }

    ngOnDestroy() { }

    opened(): Observable<boolean> {
        return this._opened.asObservable();
    }

    mode(): Observable<string> {
        return this._mode.asObservable();
    }

    items(): Observable<ProjectSidenavItem[]> {
        return this._items.asObservable();
    }
}
