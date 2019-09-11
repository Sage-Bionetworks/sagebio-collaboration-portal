import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SecondarySidenavComponent } from 'components/sidenav/secondary-sidenav/secondary-sidenav.component';
import { SecondarySidenavService } from 'components/sidenav/secondary-sidenav/secondary-sidenav.service';

@Component({
    selector: 'app',
    template: `
    <mat-sidenav-container class="app-sidenav-container">
        <mat-sidenav #sidenav>
            <!--<app-sidenav></app-sidenav>-->
        </mat-sidenav>

        <mat-sidenav-content class="app-sidenav-content">
            <app-navbar class="mat-elevation-z6"></app-navbar>
            <div class="content">
                <router-outlet></router-outlet>
            </div>
            <app-footer></app-footer>
            <app-notification></app-notification>
        </mat-sidenav-content>

        <mat-sidenav #secondarySidenav position="end" class="app-sidenav-secondary">
            <app-secondary-sidenav #secondarySidenavContent></app-secondary-sidenav>
        </mat-sidenav>
    </mat-sidenav-container>`
})
export class AppComponent implements OnInit, AfterViewInit {
    @ViewChild('secondarySidenav', { static: true }) private secondarySidenav: MatSidenav;
    @ViewChild('secondarySidenavContent', { static: true }) private secondarySidenavContent: SecondarySidenavComponent;

    static parameters = [SecondarySidenavService];
    constructor(private secondarySidenavService: SecondarySidenavService) { }

    ngOnInit() {
        this.secondarySidenav.mode = 'over';
        this.secondarySidenav.autoFocus = false;
        this.secondarySidenavService.sidenav = this.secondarySidenav;
        this.secondarySidenavService.sidenavContent = this.secondarySidenavContent;
    }

    ngAfterViewInit() { }
}
