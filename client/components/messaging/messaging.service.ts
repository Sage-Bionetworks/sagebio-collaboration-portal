import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
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
    constructor(private httpClient: HttpClient, private secondarySidenavService: SecondarySidenavService) {}

    // THEADS FUNCTIONS

    /**
     * Returns the thread specified.
     * @param id
     */
    getThread(id: string): Observable<Thread> {
        return this.httpClient.get<Thread>(`/api/threads/${id}`);
    }

    /**
     * Creates a new thread.
     * @param thread
     */
    createThread(thread: Thread): Observable<Thread> {
        return this.httpClient.post<Thread>(`/api/threads`, thread);
    }

    /**
     * Returns the thread associated to the entity specified.
     * @param entityId
     */
    getThreadsByEntity(entityId: string): Observable<Thread[]> {
        return this.httpClient
            .get<Thread[]>(`/api/threads/entity/${entityId}`)
            .pipe(map(threads => orderBy(['createdAt'], ['desc'], threads)));
    }

    /**
     * Updates the thread specified.
     * @param thread
     */
    updateThread(thread: Thread): Observable<Thread> {
        return this.httpClient.patch<Thread>(`/api/threads/${thread._id}`, [
            { op: 'replace', path: '/title', value: thread.title },
        ]);
    }

    // MESSAGES FUNCTIONS

    /**
     * Returns the messages associated to the thread specified.
     * @param thread
     */
    getMessages(thread: Thread): Observable<Message[]> {
        return this.httpClient
            .get<Message[]>(`/api/threads/${thread._id}/messages`)
            .pipe(map(messages => orderBy(['createdAt'], ['asc'], messages)));
    }

    /**
     * Creates a new message and associates it to the thread specified.
     * @param thread
     * @param message
     */
    createMessage(thread: Thread, message: Message): Observable<Message> {
        return this.httpClient.post<Message>(`/api/threads/${thread._id}/messages`, message);
    }

    /**
     * Updates the body of a message.
     * @param thread
     * @param message
     */
    updateMessage(thread: Thread, message: Message): Observable<Message> {
        return this.httpClient.patch<Message>(`/api/threads/${thread._id}/messages/${message._id}`, [
            { op: 'replace', path: '/body', value: message.body },
        ]);
    }

    /**
     * Returns the number of messages in a thread.
     * @param thread
     */
    getNumMessages(thread: Thread): Observable<number> {
        return this.httpClient
            .get<NumberValue>(`/api/threads/${thread._id}/messages/count`)
            .pipe(map(count => count.value));
    }

    /**
     * Deletes the message specified.
     * @param thread
     * @param message
     */
    removeMessage(thread: Thread, message: Message): Observable<Message> {
        return this.httpClient
            .delete<void>(`/api/threads/${thread._id}/messages/${message._id}`)
            .pipe(map(() => message));
    }

    // TO REVIEW

    getThreads(): Observable<Thread[]> {
        return this.httpClient.get<Thread[]>(`/api/threads`);
        // .pipe(
        //     map(threads => orderBy(['createdAt'], ['desc'], threads))
        // );
    }

    removeThread(thread: Thread): Observable<void> {
        return this.httpClient.delete<void>(`/api/threads/entity/${thread.entityId}/${thread._id}`);
    }

    showThread(thread: Thread): void {
        let sidenavContentId = `thread:${thread._id}`;
        if (this.secondarySidenavService.getContentId() !== sidenavContentId) {
            (<ThreadSidenavComponent>(
                this.secondarySidenavService.loadContentComponent(ThreadSidenavComponent)
            )).setThread(thread);
            this.secondarySidenavService.setContentId(sidenavContentId);
        }
        this.secondarySidenavService.open();
    }

    // getThreads(query?: {}): Observable<Thread[]> {
    //     return this.httpClient.get<Thread[]>(`/api/messages/threads${stringifyQuery(query)}`)
    //         .pipe(
    //             map(threads => orderBy(['updatedAt'], ['desc'], threads))
    //         );
    // }

    // updateThread(thread: Thread): Observable<Thread> {
    //     return this.httpClient.patch<Thread>(`/api/messages/threads/${thread._id}`,
    //         [
    //             { op: 'replace', path: '/title', value: thread.title },
    //             { op: 'add', path: '/updatedBy', value: thread.updatedBy },
    //             { op: 'add', path: '/updatedAt', value: Date.now() },
    //         ]
    //     );
    // }

    /**
     * Messages
     */

    // getMessages(query?: {}): Observable<Message[]> {
    //     return this.httpClient.get<Message[]>(`/api/messages${stringifyQuery(query)}`)
    //         .pipe(
    //             map(messages => orderBy(['createdAt'], ['asc'], messages))
    //         );
    // }

    // getMessage(messageId: string): Observable<Message> {
    //     return this.httpClient.get<Message>(`/api/messages/${messageId}`);
    // }

    // addMessage(message: Message): Observable<Message> {
    //     return this.httpClient.post<Message>('/api/messages', message);
    // }

    // updateMessage(message: Message): Observable<Message> {
    //     return this.httpClient.patch<Message>(`/api/messages/${message._id}`,
    //         [
    //             { op: 'replace', path: '/body', value: message.body },
    //             { op: 'add', path: '/updatedBy', value: message.updatedBy },
    //             { op: 'add', path: '/updatedAt', value: Date.now() },
    //         ]
    //     );
    // }

    // removeMessage(message: Message): Observable<void> {
    //     return this.httpClient.delete<void>(`/api/messages/${message._id}`);
    // }

    /**
     * Stars
     */

    // starMessage(message: Message): Observable<StarredMessage> {
    //     return this.httpClient.post<StarredMessage>(`/api/messages/${message._id}/star`, {});
    // }

    // unstarMessage(message: Message): Observable<StarredMessage> {
    //     return this.httpClient.delete<StarredMessage>(`/api/messages/${message._id}/unstar`);
    // }

    // getNumStars(message: Message): Observable<number> {
    //     return this.httpClient.get<NumberValue>(`/api/messages/${message._id}/stars/count`)
    //         .pipe(
    //             map(count => count.value)
    //         );
    // }

    // getStarredMessages(query?: {}): Observable<StarredMessage[]> {
    //     return this.httpClient.get<StarredMessage[]>(`/api/messages/stars/mine${stringifyQuery(query)}`);
    // }

    // archiveStar(message: Message): Observable<StarredMessage> {
    //     console.log(`/api/messages/${message._id}/star/archive`);
    //     return this.httpClient.patch<StarredMessage>(`/api/messages/${message._id}/star/archive`, []);
    // }

    // unarchiveStar(message: Message): Observable<StarredMessage> {
    //     return this.httpClient.patch<StarredMessage>(`/api/messages/${message._id}/star/unarchive`, []);
    // }

    /**
     * Messages
     */

    // getReplies(message: Message, query?: {}): Observable<Message[]> {
    //     return this.httpClient.get<Message[]>(`/api/messages/${message._id}/replies${stringifyQuery(query)}`)
    //         .pipe(
    //             map(replies => orderBy(['createdAt'], ['asc'], replies))
    //         );
    // }

    // getNumReplies(message: Message): Observable<number> {
    //     return this.httpClient.get<NumberValue>(`/api/messages/${message._id}/replies/count`)
    //         .pipe(
    //             map(count => count.value)
    //         );
    // }

    // addReply(thread: Message, reply: Message): Observable<Message> {
    //     return this.httpClient.post<Message>(`/api/messages/${thread._id}/replies`, reply);
    // }

    // showThread(): void {
    //     this.sidenavService.toggle();
    // }
}
