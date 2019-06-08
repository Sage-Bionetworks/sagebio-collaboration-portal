import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../components/material/material.module';
import { NavbarUserButton } from './navbar-user-button.component';
import { AvatarModule } from 'ng2-avatar';
import { UserAvatarModule } from '../user-avatar/user-avatar.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        AvatarModule,
        UserAvatarModule
    ],
    declarations: [
        NavbarUserButton
    ],
    exports: [
        NavbarUserButton
    ]
})
export class NavbarUserButtonModule { }
