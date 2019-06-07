import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavService } from '../components/sidenav/sidenav.service';
import { SidenavSecondaryComponent } from '../components/sidenav/sidenav-secondary/sidenav-secondary.component';

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
            <app-sidenav-secondary #sidenavSecondaryContent></app-sidenav-secondary>
        </mat-sidenav>
    </mat-sidenav-container>`
})
export class AppComponent implements OnInit, AfterViewInit {
    @ViewChild('sidenavSecondary') private sidenavSecondary: MatSidenav;
    @ViewChild('sidenavSecondaryContent') private sidenavSecondaryContent: SidenavSecondaryComponent;

    static parameters = [SidenavService];
    constructor(private sidenavService: SidenavService) { }

    ngOnInit() {
        this.sidenavSecondary.mode = 'side';
        this.sidenavSecondary.autoFocus = false;
        this.sidenavService.sidenav = this.sidenavSecondary;
        this.sidenavService.sidenavContent = this.sidenavSecondaryContent;
    }

    ngAfterViewInit() {
    }
}
