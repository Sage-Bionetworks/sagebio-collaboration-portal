import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SocketService } from '../../components/socket/socket.service';
import { PageTitleService } from '../../components/page-title/page-title.service';
import { NotificationService } from '../../components/notification/notification.service';

@Component({
    selector: 'app-main',
    template: require('./main.html'),
    styles: [require('./main.scss')],
    // providers: [ SocketService ],
})
export class MainComponent implements OnInit, OnDestroy {
    Http;
    SocketService;
    token;
    socketSub;

    static parameters = [HttpClient, SocketService, PageTitleService,
        NotificationService];
    constructor(private http: HttpClient, private socketService: SocketService,
        private pageTitleService: PageTitleService,
        private notificationService: NotificationService) {
        this.Http = http;
        this.SocketService = socketService;
        this.token = localStorage.getItem('access_token');
    }

    ngOnInit() {
        this.pageTitleService.title = '';
    }

    ngOnDestroy() {
        if (this.socketSub) {
            // this.SocketService.unsyncUpdates('thing');
            // this.socketSub.unsubscribe();
        }
    }

    plop(): void {
      console.log('plop');
      this.notificationService.success('Plop');
    }
}
