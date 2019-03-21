import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SocketService } from '../../components/socket/socket.service';

interface Thing {
    name: string;
    info?: string;
}

@Component({
    selector: 'main',
    template: require('./main.html'),
    styles: [require('./main.scss')],
})
export class MainComponent implements OnInit, OnDestroy {
    SocketService;
    awesomeThings: Thing[] = [];
    newThing = '';

    static parameters = [HttpClient, SocketService];
    constructor(private http: HttpClient, private socketService: SocketService) {
        this.http = http;
        this.SocketService = socketService;
    }

    ngOnInit() {
        return this.http.get('/api/things')
            .subscribe((things: Thing[]) => {
                this.awesomeThings = things;
                this.SocketService.syncUpdates('thing', this.awesomeThings);
            });
    }


    ngOnDestroy() {
        this.SocketService.unsyncUpdates('thing');
    }

    addThing() {
        if(this.newThing) {
            let text = this.newThing;
            this.newThing = '';

            return this.http.post('/api/things', { name: text })
                .subscribe(thing => {
                    console.log('Added Thing:', thing);
                });
        }
    }

    deleteThing(thing) {
        return this.http.delete(`/api/things/${thing._id}`)
            .subscribe(() => {
                console.log('Deleted Thing');
            });
    }
}
