import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, Subscription, from, forkJoin } from 'rxjs';
import { mergeMap, tap, switchMap, map as rxMap, concatAll, mergeAll, reduce } from 'rxjs/operators';
import { StarredMessage } from 'models/messaging/starred-message.model';
import { AuthService } from 'components/auth/auth.service';
import { SocketService } from 'components/socket/socket.service';
import { MessagingService } from './messaging.service';


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
