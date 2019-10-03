import { ProjectAuthorizationService } from './../project-authorization.service';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ProjectSidenavItem } from './models/project-sidenav-item.model';

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
    private opened_: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    private mode_: BehaviorSubject<string> = new BehaviorSubject<string>('side');
    private items_: BehaviorSubject<ProjectSidenavItem[]> = new BehaviorSubject<ProjectSidenavItem[]>([{
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

    private sub: Subscription;

    static parameters = [ProjectAuthorizationService];
    constructor(private projectAuthorizationService: ProjectAuthorizationService) {
        this.sub = this.projectAuthorizationService.authorization().subscribe(auth => {
            let items = this.items_.getValue();
            items.find(item => item.title === itemTitles.SETTINGS).visible = auth.canAdmin;
            this.items_.next(items);
        });
    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    opened(): Observable<boolean> {
        return this.opened_.asObservable();
    }

    mode(): Observable<string> {
        return this.mode_.asObservable();
    }

    items(): Observable<ProjectSidenavItem[]> {
        return this.items_.asObservable();
    }
}
