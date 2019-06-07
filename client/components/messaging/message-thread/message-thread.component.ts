import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { SidenavService } from '../../sidenav/sidenav.service';
import { SocketService } from '../../socket/socket.service';
import { Message } from '../../../../shared/interfaces/discussion/message.model';
import { MessagingService } from '../messaging.service';

@Component({
    selector: 'message-thread',
    template: require('./message-thread.html'),
    styles: [require('./message-thread.scss')]
})
export class MessageThreadComponent implements OnInit, AfterViewInit {
    // @ViewChild('thread') threadTemplate;
    // public title = '';
    private message: Message;
    private replies: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);

    static parameters = [SidenavService, MessagingService, SocketService];
    constructor(private sidenavService: SidenavService,
        private messagingService: MessagingService,
        private socketService: SocketService) { }

    ngOnInit() { }

    ngAfterViewInit() {
        // console.log(this.threadTemplate);
    }

    ngOnDestroy() { }

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



        // this._starredMessages.next(starred);
        // this.socketService.syncArraySubject('starredMessage', this._starredMessages);
        //
        //   this.socketService.syncArraySubject()
          // this.replies = this.messagingService.getReplies(message);

      }
    }

    close(): void {
        this.sidenavService.close();
    }
}
