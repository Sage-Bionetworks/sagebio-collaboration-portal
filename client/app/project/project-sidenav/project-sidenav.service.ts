import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
// import { map } from 'rxjs/operators';
import { MatSidenav, MatDrawerToggleResult } from '@angular/material/sidenav';
// import { InstanceDataService } from '../instance-data.service';
// import { SidenavService } from '../../../components/sidenav/sidenav.service';
// import { SidenavItem } from '../../../components/sidenav/sidenav-item';
// import { Instance } from '../../../../shared/interfaces/instance';
// import { Hero } from '../../../../shared/interfaces/hero';
// import { HeroItem } from '../../../../shared/interfaces/hero-item';
// import { Item } from '../../../../shared/interfaces/item';

// interface SidenavItemInputs {
//     isGameMaster: boolean;
//     hero: Hero;
//     heroItems: HeroItem<Item>[];
// }

@Injectable()
export class ProjectSidenavService implements OnDestroy {
    // public sidenav: MatSidenav;
    //
    // private _items: BehaviorSubject<SidenavItem[]> = new BehaviorSubject<SidenavItem[]>([
    //     {
    //         title: 'Dashboard',
    //         icon: 'dashboard',
    //         routerLink: ['dashboard'],
    //         routerLinkActiveOptions: {},
    //         visible: true
    //     },
    //     {
    //         title: 'Game Master',
    //         icon: 'face',
    //         routerLink: ['gm'],
    //         routerLinkActiveOptions: {},
    //         visible: false
    //     },
    //     {
    //         title: 'Inventory',
    //         icon: 'apps',
    //         routerLink: ['inventory'],
    //         routerLinkActiveOptions: {},
    //         visible: false,
    //         notifications: 0
    //     },
    //     {
    //         title: 'Settings',
    //         icon: 'settings',
    //         routerLink: ['settings'],
    //         routerLinkActiveOptions: {},
    //         visible: true
    //     }
    // ]);

    // private updateItemsSub: Subscription;
    // private updateAppSidenavSub: Subscription;

    static parameters = [];
    constructor() {
        // this.updateItemsSub = combineLatest([
        //     this.instanceDataService.isGameMaster(),
        //     this.instanceDataService.getHero(),
        //     this.instanceDataService.getHeroItems()
        // ]).pipe(
        //     map((res: SidenavItemInputs): SidenavItem[] => {
        //         const isGameMaster = res[0];
        //         const hero: Hero = res[1];
        //         const heroItems: HeroItem<Item>[] = res[2];
        //
        //         var items = this._items.getValue();
        //         items.find(item => item.title === 'Game Master').visible = isGameMaster;
        //         items.find(item => item.title === 'Inventory').visible = !!hero;
        //         items.find(item => item.title === 'Inventory').notifications =
        //             heroItems.filter(item => !item.seen).length;
        //
        //         return items;
        //     })
        // ).subscribe((items: SidenavItem[]) => {
        //     this._items.next(items);
        // });
    }

    // public init(instance: Instance): void {
    //     this.updateAppSidenavSub = this._items.subscribe(items =>
    //         this.sidenavService.setInstanceItems(
    //             items.map(item => {
    //                 let it = { ...item };
    //                 it.routerLink = ['instances', instance._id, ...it.routerLink];
    //                 return it;
    //             })));
    // }

    ngOnDestroy() {
        // this.updateItemsSub.unsubscribe();
        // this.updateAppSidenavSub.unsubscribe();
        // this.sidenavService.setInstanceItems([]);
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
