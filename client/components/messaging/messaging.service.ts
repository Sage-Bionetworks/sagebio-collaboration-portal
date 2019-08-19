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
import { Thread } from 'models/messaging/thread.model';
import { Message } from 'models/messaging/message.model';
import { StarredMessage } from 'models/messaging/starred-message.model';
import { NumberValue } from 'models/number-value.model';
import { stringifyQuery } from 'components/util';
import { some, orderBy, head } from 'lodash/fp';
import { SecondarySidenavService } from '../sidenav/secondary-sidenav/secondary-sidenav.service';
import { ThreadSidenavComponent } from './thread-sidenav/thread-sidenav.component';

@Injectable()
export class MessagingService {

    static parameters = [HttpClient, SecondarySidenavService];
    constructor(private httpClient: HttpClient,
        private secondarySidenavService: SecondarySidenavService) { }

    /**
     * Threads
     */
    addThread(thread: Thread): Observable<Thread> {
        return this.httpClient.post<Thread>('/api/messages/threads', thread);
    }

    getThreads(query?: {}): Observable<Thread[]> {
        return this.httpClient.get<Thread[]>(`/api/messages/threads${stringifyQuery(query)}`)
            .pipe(
                map(threads => orderBy(['updatedAt'], ['desc'], threads))
            );
    }

    getThreadsByEntity(entityId: string): Observable<Thread[]> {
        return this.httpClient.get<Thread[]>(`/api/messages/threads/entity/${entityId}`)
            .pipe(
                map(threads => orderBy(['updatedAt'], ['desc'], threads))
            );
    }

    removeThread(thread: Thread): Observable<void> {
        return this.httpClient.delete<void>(`/api/messages/threads/${thread._id}`);
    }

    showThread(thread: Thread): void {
        let sidenavContentId = `thread:${thread._id}`;
        if (this.secondarySidenavService.getContentId() !== sidenavContentId) {
            (<ThreadSidenavComponent>this.secondarySidenavService
                .loadContentComponent(ThreadSidenavComponent))
                .setThread(thread);
            this.secondarySidenavService.setContentId(sidenavContentId);
        }
        this.secondarySidenavService.open();
    }

    updateThread(thread: Thread): Observable<Thread> {
        return this.httpClient.patch<Thread>(`/api/messages/threads/${thread._id}`,
            [
                { op: 'replace', path: '/title', value: thread.title },
                { op: 'add', path: '/updatedBy', value: thread.updatedBy },
                { op: 'add', path: '/updatedAt', value: Date.now() },
            ]
        );
    }

    getMessagesForThread(threadId: string): Observable<Message[]> {
        return this.httpClient.get<Message[]>(`/api/messages/threads/messages/${threadId}`)
            .pipe(
                map(messages => orderBy(['createdAt'], ['asc'], messages))
            );
    }

    addMessageToThread(message: Message, thread: Thread): Observable<Message> {
        return this.httpClient.post<Message>(`/api/messages/threads/${thread._id}`, message);
    }

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
        return this.httpClient.post<Message>('/api/messages', message);
    }

    updateMessage(message: Message): Observable<Message> {
        return this.httpClient.patch<Message>(`/api/messages/${message._id}`,
            [
                { op: 'replace', path: '/body', value: message.body },
                { op: 'add', path: '/updatedBy', value: message.updatedBy },
                { op: 'add', path: '/updatedAt', value: Date.now() },
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
