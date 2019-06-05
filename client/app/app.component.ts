import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavService } from '../components/sidenav/sidenav.service';

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

        <mat-sidenav #sidenavSecondary position="end" class="app-sidenav-secondary">
            <app-sidenav-secondary></app-sidenav-secondary>
        </mat-sidenav>
    </mat-sidenav-container>`
})
export class AppComponent implements AfterViewInit {
    @ViewChild('sidenavSecondary') private sidenavSecondary: MatSidenav;

    static parameters = [SidenavService];
    constructor(private sidenavService: SidenavService) { }

    ngAfterViewInit(): void {
        this.sidenavSecondary.mode = 'side';
        this.sidenavSecondary.autoFocus = false;
        this.sidenavService.sidenav = this.sidenavSecondary;
    }
}
