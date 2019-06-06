import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

@Component({
    selector: 'message-thread',
    template: require('./message-thread.html'),
    styles: [require('./message-thread.scss')]
})
export class MessageThreadComponent implements OnInit, AfterViewInit {
    @ViewChild('thread') threadTemplate;

    static parameters = [];
    constructor() { }

    ngOnInit() { }

    ngAfterViewInit() {
        console.log(this.threadTemplate);
    }

    ngOnDestroy() { }
}
