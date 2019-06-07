import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { SidenavService } from '../../sidenav/sidenav.service';
import { Message } from '../../../../shared/interfaces/discussion/message.model';

@Component({
    selector: 'message-thread',
    template: require('./message-thread.html'),
    styles: [require('./message-thread.scss')]
})
export class MessageThreadComponent implements OnInit, AfterViewInit {
    // @ViewChild('thread') threadTemplate;
    // public title = '';
    private message: Message;

    static parameters = [SidenavService];
    constructor(private sidenavService: SidenavService) { }

    ngOnInit() { }

    ngAfterViewInit() {
        // console.log(this.threadTemplate);
    }

    ngOnDestroy() { }

    setMessage(message: Message): void {
        this.message = message;
    }

    close(): void {
        this.sidenavService.close();
    }
}
