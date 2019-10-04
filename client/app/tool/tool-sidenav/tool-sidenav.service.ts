import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ToolSidenavItem } from './models/tool-sidenav-item.model'; // TODO Move closer to client side
import { ToolAuthorizationService } from '../tool-authorization.service';
import { ToolDataService } from '../tool-data.service';

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

    static parameters = [ToolDataService, ToolAuthorizationService];
    constructor(private toolDataService: ToolDataService, private toolAuthorizationService: ToolAuthorizationService) {
        this.sub = this.toolDataService
            .tool()
            .pipe(
                tap(tool => console.log('TOOL', tool)),
                switchMap(tool => this.toolAuthorizationService.canAdmin(tool._id))
            )
            .subscribe(
                canAdmin => {
                    console.log('CAN ADMIN', canAdmin);
                    let items = this.items_.getValue();
                    items.find(item => item.title === itemTitles.SETTINGS).visible = canAdmin;
                    this.items_.next(items);
                },
                err => console.error(err)
            );
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
