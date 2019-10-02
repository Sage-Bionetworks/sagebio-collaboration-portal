import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-thread',
    template: require('./app-thread.html'),
    styles: [require('./app-thread.scss')],
})
export class AppThreadComponent {
    static parameters = [Router];
    constructor(private router: Router) {}
}
