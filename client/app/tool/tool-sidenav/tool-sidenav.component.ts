import { Component } from '@angular/core';
import { ToolSidenavService } from './tool-sidenav.service';

@Component({
    selector: 'tool-sidenav',
    template: require('./tool-sidenav.html'),
    styles: [require('./tool-sidenav.scss')],
})
export class ToolSidenavComponent {
    static parameters = [ToolSidenavService];
    constructor(private toolSidenavService: ToolSidenavService) {} // used in html
}
