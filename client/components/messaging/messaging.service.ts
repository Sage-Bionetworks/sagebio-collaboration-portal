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
import { stringifyQuery } from '../../components/util';
import { some, orderBy, head } from 'lodash/fp';

@Injectable()
export class MessagingService {

    static parameters = [HttpClient];
    constructor(private httpClient: HttpClient) { }

    getMessages(query?: {}): Observable<Message[]> {
        return this.httpClient.get<Message[]>(`/api/messages${stringifyQuery(query)}`);
    }

    addMessage(message: Message): Observable<Message> {
        return this.httpClient.post<Message>('/api/messages/', message);
    }

    removeMessage(message: Message): Observable<Message> {
        return this.httpClient.delete<Message>(`/api/messages/${message._id}`);
          // .pipe(
          //     map(() => message)
          // );
    }
}
