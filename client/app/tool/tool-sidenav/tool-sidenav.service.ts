import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ToolSidenavItem } from './models/tool-sidenav-item.model';
import { ToolAuthorizationService } from '../tool-authorization.service';

const enum itemTitles {
    HOME = 'Home',
    DISCUSSION = 'Discussion',
    ACTIVITY = 'Activity',
    SETTINGS = 'Settings',
}

@Injectable()
export class ToolSidenavService implements OnDestroy {
    private opened_: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    private mode_: BehaviorSubject<string> = new BehaviorSubject<string>('side');
    private items_: BehaviorSubject<ToolSidenavItem[]> = new BehaviorSubject<ToolSidenavItem[]>([
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
            routerLink: ['activity'],
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

    private sub: Subscription;

    static parameters = [ToolAuthorizationService];
    constructor(private toolAuthorizationService: ToolAuthorizationService) {
        this.sub = this.toolAuthorizationService.authorization().subscribe(auth => {
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

    items(): Observable<ToolSidenavItem[]> {
        return this.items_.asObservable();
    }
}
