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
import { stringifyQuery } from '../../components/util';
import { some, orderBy, head } from 'lodash/fp';
import { SecondarySidenavService } from '../sidenav/secondary-sidenav/secondary-sidenav.service';
import { ThreadSidenavComponent } from './thread/thread-sidenav/thread-sidenav.component';

@Injectable()
export class MessagingService {

    static parameters = [HttpClient, SecondarySidenavService];
    constructor(private httpClient: HttpClient,
        private secondarySidenavService: SecondarySidenavService) { }

    /**
     * Messages
     */

    getMessages(query?: {}): Observable<Message[]> {
        return this.httpClient.get<Message[]>(`/api/messages${stringifyQuery(query)}`)
            .pipe(
                map(messages => orderBy(['createdAt'], ['asc'], messages))
            );
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

    showThread(message: Message): void {
        let sidenavContentId = `thread:${message._id}`;
        if (this.secondarySidenavService.getContentId() !== sidenavContentId) {
            (<ThreadSidenavComponent>this.secondarySidenavService
                .loadContentComponent(ThreadSidenavComponent))
                .setMessage(message);
            this.secondarySidenavService.setContentId(sidenavContentId);
        }
        this.secondarySidenavService.open();
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
        return this.httpClient.get<Message[]>(`/api/messages/${message._id}/replies${stringifyQuery(query)}`)
            .pipe(
                map(replies => orderBy(['createdAt'], ['asc'], replies))
            );
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
