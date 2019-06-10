import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { SecondarySidenavService } from '../../../sidenav/secondary-sidenav/secondary-sidenav.service';
import { SocketService } from '../../../socket/socket.service';
import { Message } from '../../../../../shared/interfaces/discussion/message.model';
import { MessagingService } from '../../messaging.service';

@Component({
    selector: 'thread-sidenav',
    template: require('./thread-sidenav.html'),
    styles: [require('./thread-sidenav.scss')]
})
export class ThreadSidenavComponent implements OnInit, AfterViewInit {
    private message: Message;
    private replies: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);

    static parameters = [SecondarySidenavService, MessagingService, SocketService];
    constructor(private sidenavService: SecondarySidenavService,
        private messagingService: MessagingService,
        private socketService: SocketService) { }

    ngOnInit() { }

    ngAfterViewInit() { }

    ngOnDestroy() {
      console.log('Destroy sidenav content');
    }

    setMessage(message: Message): void {
      if (message) {
        this.messagingService.getReplies(message)
            .subscribe(replies => {
                this.replies.next(replies);

                this.replies.subscribe(items => console.log('ITEMS', items));

                console.log(`listening to model message:thread:${message._id}`);
                this.socketService.syncArraySubject(`thread:${message._id}:message`, this.replies);
                this.message = message;
            });
      }
    }

    close(): void {
        this.sidenavService.close();
    }
}
