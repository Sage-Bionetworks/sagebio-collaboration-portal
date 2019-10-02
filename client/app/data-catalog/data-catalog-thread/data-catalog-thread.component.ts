import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'data-catalog-thread',
    template: require('./data-catalog-thread.html'),
    styles: [require('./data-catalog-thread.scss')],
})
export class DataCatalogThreadComponent {
    static parameters = [Router];
    constructor(private router: Router) {}
}
