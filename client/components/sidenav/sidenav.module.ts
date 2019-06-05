import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../components/material/material.module';
import { SidenavSecondaryComponent } from './sidenav-secondary/sidenav-secondary.component';
import { SidenavService } from './sidenav.service';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule
    ],
    providers: [
        SidenavService
    ],
    declarations: [
        SidenavSecondaryComponent
    ],
    exports: [
        SidenavSecondaryComponent
    ]
})
export class SidenavModule { }
