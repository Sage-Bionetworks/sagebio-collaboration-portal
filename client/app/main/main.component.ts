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

    neo4jframe;
    viz;
    emptyObj1;
    emptyObj;
    info;

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
    }

    // viewNodesStart() {
    //
    //     // console.log("INSIDE viewNodesStart()")
    //
    //     // Nodes Value
    //
    //     // console.log("inside Nodes Value");
    //     var data = localStorage.getItem('token');
    //
    //     // console.log("data is=>", data + "emptyobj1 = " + this.emptyObj1);
    //
    //     var url = config.url;
    //     var port = config.port;
    //
    //     var object = {
    //         emptyObj: this.emptyObj
    //     }
    //
    //     this.http.post('http://' + url + ':' + port + '/viewNodesStart', this.emptyObj1)
    //         .map(Response => Response)
    //         .subscribe((res: Response) => {
    //
    //             // console.log('XXXXXXXXXXXX Response on /viewNodesStart', res);
    //
    //             this.info = res;
    //             if (this.info.statusCode == 200) {
    //                 console.log("Data added successfully");
    //
    //             } else {
    //                 console.log("Data is not inserted")
    //
    //             }
    //
    //         });
    //
    // }
}
