import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, Subscription, from, forkJoin } from 'rxjs';
import { mergeMap, tap, switchMap, map as rxMap, concatAll, mergeAll, reduce } from 'rxjs/operators';
import { StarredMessage } from '../../../shared/interfaces/discussion/starred-message.model';
// import { Game } from '../../../shared/interfaces/game';
// import { Hero } from '../../../shared/interfaces/hero';
// import { Item } from '../../../shared/interfaces/item';
// import { Card } from '../../../shared/interfaces/card';
// import { Token } from '../../../shared/interfaces/token';
// import { HeroItem } from '../../../shared/interfaces/hero-item';
// import { InstanceService } from './instance.service';
// import { InstanceSocketService } from './instance-socket.service';
import { AuthService } from '../../components/auth/auth.service';
// import { HeroService } from '../../components/hero/hero.service';
// import { ItemService } from '../../components/item/item.service';
import { SocketService } from '../../components/socket/socket.service';
import { MessagingService } from './messaging.service';
// import { differenceWith, find, includes, map, remove } from 'lodash';

@Injectable()
export class MessagingDataService implements OnDestroy {
    private _starredMessages: BehaviorSubject<StarredMessage[]> = new BehaviorSubject<StarredMessage[]>([]);

    static parameters = [AuthService, SocketService, MessagingService];
    constructor(private authService: AuthService,
        private socketService: SocketService,
        private messagingService: MessagingService) {

        this.messagingService.getStarredMessages()
            .subscribe(starred => {
                this._starredMessages.next(starred);
                this.socketService.syncArraySubject('starredMessage', this._starredMessages);
            });
    }

    ngOnDestroy() { }

    /**
     * Returns the starred messages.
     * @return {Observable<StarredMessage[]>}
     */
    getStarredMessages(): Observable<StarredMessage[]> {
        return this._starredMessages.asObservable();
    }
}
