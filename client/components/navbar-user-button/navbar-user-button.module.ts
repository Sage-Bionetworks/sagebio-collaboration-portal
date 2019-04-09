import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../components/material/material.module';
// import { ImageModule } from '../../components/image/image.module';
import { NavbarUserButton } from './navbar-user-button.component';
import { AvatarModule } from 'ng2-avatar';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        AvatarModule
        // ImageModule
    ],
    declarations: [NavbarUserButton],
    exports: [NavbarUserButton]
})
export class NavbarUserButtonModule { }
