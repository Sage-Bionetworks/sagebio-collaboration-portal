import { Component } from '@angular/core';

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
    </mat-sidenav-container>`
})
export class AppComponent { }
