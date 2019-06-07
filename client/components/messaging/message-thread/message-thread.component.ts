import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { SidenavService } from '../../sidenav/sidenav.service';

@Component({
    selector: 'message-thread',
    template: require('./message-thread.html'),
    styles: [require('./message-thread.scss')]
})
export class MessageThreadComponent implements OnInit, AfterViewInit {
    // @ViewChild('thread') threadTemplate;
    public title = '';

    static parameters = [SidenavService];
    constructor(private sidenavService: SidenavService) { }

    ngOnInit() { }

    ngAfterViewInit() {
        // console.log(this.threadTemplate);
    }

    ngOnDestroy() { }

    close(): void {
        this.sidenavService.close();
    }
}
