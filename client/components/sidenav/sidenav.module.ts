import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../components/material/material.module';
import { SecondarySidenavComponent } from './secondary-sidenav/secondary-sidenav.component';
import { SecondarySidenavService } from './secondary-sidenav/secondary-sidenav.service';
import { SidenavHostDirective } from './sidenav-host.directive';
import { ThreadSidenavComponent } from '../messaging/thread/thread-sidenav/thread-sidenav.component';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule
    ],
    providers: [
        SecondarySidenavService
    ],
    declarations: [
        SecondarySidenavComponent,
        SidenavHostDirective
    ],
    exports: [
        SecondarySidenavComponent
    ],
    entryComponents: [
        ThreadSidenavComponent
    ]
})
export class SidenavModule { }
