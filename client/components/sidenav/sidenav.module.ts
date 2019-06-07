import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../components/material/material.module';
import { SidenavSecondaryComponent } from './sidenav-secondary/sidenav-secondary.component';
import { SidenavService } from './sidenav.service';
import { SidenavHostDirective } from './sidenav-host.directive';

import { MessageThreadComponent } from '../messaging/message-thread/message-thread.component';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule
    ],
    providers: [
        SidenavService
    ],
    declarations: [
        SidenavSecondaryComponent,
        SidenavHostDirective
    ],
    exports: [
        SidenavSecondaryComponent
    ],
    // entryComponents: [
    //     MessageThreadComponent
    // ]
})
export class SidenavModule { }
