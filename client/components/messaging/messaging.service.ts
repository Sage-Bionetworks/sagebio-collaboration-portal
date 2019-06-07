import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    map,
    switchMap,
    tap
} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Message } from '../../../shared/interfaces/discussion/message.model';
import { StarredMessage } from '../../../shared/interfaces/discussion/starred-message.model';
import { NumberValue } from '../../../shared/interfaces/number-value.model';
import { SidenavService } from '../sidenav/sidenav.service';

import { stringifyQuery } from '../../components/util';
import { some, orderBy, head } from 'lodash/fp';

@Injectable()
export class MessagingService {

    static parameters = [HttpClient, SidenavService];
    constructor(private httpClient: HttpClient,
        private sidenavService: SidenavService) { }

    /**
     * Messages
     */

    getMessages(query?: {}): Observable<Message[]> {
        return this.httpClient.get<Message[]>(`/api/messages${stringifyQuery(query)}`);
    }

    getMessage(messageId: string): Observable<Message> {
        return this.httpClient.get<Message>(`/api/messages/${messageId}`);
    }

    addMessage(message: Message): Observable<Message> {
        return this.httpClient.post<Message>('/api/messages/', message);
    }

    updateMessage(message: Message): Observable<Message> {
        return this.httpClient.patch<Message>(`/api/messages/${message._id}`,
            [
                { op: 'replace', path: '/body', value: message.body }
            ]
        );
    }

    removeMessage(message: Message): Observable<void> {
        return this.httpClient.delete<void>(`/api/messages/${message._id}`);
    }

    /**
     * Stars
     */

    starMessage(message: Message): Observable<StarredMessage> {
        return this.httpClient.post<StarredMessage>(`/api/messages/${message._id}/star`, {});
    }

    unstarMessage(message: Message): Observable<StarredMessage> {
        return this.httpClient.delete<StarredMessage>(`/api/messages/${message._id}/unstar`);
    }

    getNumStars(message: Message): Observable<number> {
        return this.httpClient.get<NumberValue>(`/api/messages/${message._id}/stars/count`)
            .pipe(
                map(count => count.value)
            );
    }

    getStarredMessages(query?: {}): Observable<StarredMessage[]> {
        return this.httpClient.get<StarredMessage[]>(`/api/messages/stars/mine${stringifyQuery(query)}`);
    }

    archiveStar(message: Message): Observable<StarredMessage> {
        console.log(`/api/messages/${message._id}/star/archive`);
        return this.httpClient.patch<StarredMessage>(`/api/messages/${message._id}/star/archive`, []);
    }

    unarchiveStar(message: Message): Observable<StarredMessage> {
        return this.httpClient.patch<StarredMessage>(`/api/messages/${message._id}/star/unarchive`, []);
    }

    /**
     * Replies
     */

    getReplies(message: Message, query?: {}): Observable<Message[]> {
        return this.httpClient.get<Message[]>(`/api/messages/${message._id}/replies${stringifyQuery(query)}`);
    }

    getNumReplies(message: Message): Observable<number> {
        return this.httpClient.get<NumberValue>(`/api/messages/${message._id}/replies/count`)
            .pipe(
                map(count => count.value)
            );
    }

    addReply(thread: Message, reply: Message): Observable<Message> {
        return this.httpClient.post<Message>(`/api/messages/${thread._id}/replies`, reply);
    }


    // showThread(): void {
    //     this.sidenavService.toggle();
    // }
}
