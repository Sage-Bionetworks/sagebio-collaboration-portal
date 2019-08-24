import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter, take, switchMap } from 'rxjs/operators';
import { SecondarySidenavService } from '../../sidenav/secondary-sidenav/secondary-sidenav.service';
import { SocketService } from '../../socket/socket.service';
import { Thread } from 'models/messaging/thread.model';
import { Message } from 'models/messaging/message.model';
import { MessagingService } from '../messaging.service';
import { UserService } from 'components/auth/user.service';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { User } from 'models/auth/user.model';
import { AuthService } from 'components/auth/auth.service';

@Component({
    selector: 'thread-sidenav',
    template: require('./thread-sidenav.html'),
    styles: [require('./thread-sidenav.scss')],
})
export class ThreadSidenavComponent implements OnDestroy {
    // private thread: Thread;
    private _thread: BehaviorSubject<Thread> = new BehaviorSubject<Thread>(undefined);
    private _messages: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);

    // private message: Message;
    // private messages: Message[];
    // private replies: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);
    private user: User;
    private editThread = false;

    private canCreateThread = false;
    private canDeleteThread = false;
    private canEditThread = false;

    static parameters = [SecondarySidenavService, MessagingService, SocketService,
        UserService, UserPermissionDataService, Router, AuthService];
    constructor(
        private secondarySidenavService: SecondarySidenavService,
        private messagingService: MessagingService,
        private socketService: SocketService,
        private userService: UserService,
        private userPermissionDataService: UserPermissionDataService,
        private router: Router,
        private authService: AuthService
    ) {
        this._thread
            .pipe(
                filter(thread => !!thread),
                take(1),
                switchMap(thread => this.messagingService.getMessagesByThread(thread))
            )
            .subscribe(messages => {
                this._messages.next(messages);
            }, err => console.error(err));

        // // Get the current user
        // this.auth
        // // this.userService.get().subscribe(user => {
        // //     this.user = user;
        // // });

        // this.userPermissionDataService.permissions().subscribe(permissions => {
        //     // TODO Portal admin users should be able to edit public threads
        //     // TODO Thread authors should be able to edit their own publicly created threads
        //     // TODO Portal admin users should be able to edit entity threads
        //     // TODO Entity admin users should be able to edit entity threads
        //     // TODO Thread authors should be able to edit their own publicly created threads
        //     this.canEditThread = permissions.isAdmin();
        // });

        this.router.events.pipe(
            filter(event => event instanceof NavigationStart)
          ).subscribe(_ => this.close());
    }

    ngOnDestroy() {}

    // refreshMessages(): void {
    //     this.messagingService.getMessagesForThread(this.thread._id).subscribe(messages => {
    //         this.messages = messages;
    //         this.message = messages[0];
    //     });
    // }

    setThread(thread: Thread): void {
        this._thread.next(thread);
        // this.thread = thread;
        // this.refreshMessages();
    }

    updateThread(): void {
        // const updatedThread: Thread = this.thread;
        // updatedThread.updatedBy = this.user;

        // this.messagingService.updateThread(updatedThread).subscribe(thread => {
        //     this.thread = thread;
        //     this.refreshMessages();
        // });
    }

    onEditThread(thread): void {
        // this.thread = thread;
        // this.editThread = false;
        // this.refreshMessages();
    }

    onCancel(): void {
        this.editThread = false;
    }

    onEditMessage(): void {
        this.updateThread();
    }

    onDeleteMessage(): void {
        // this.refreshMessages();
    }

    onNewMessage(): void {
        // this.updateThread();
    }

    close(): void {
        this.secondarySidenavService.close();
        this.secondarySidenavService.destroyContentComponent();
    }

    editThreadTitle(): void {
        this.editThread = !this.editThread;
    }
}
