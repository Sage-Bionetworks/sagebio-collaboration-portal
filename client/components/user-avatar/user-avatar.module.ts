import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'ng2-avatar';
import { UserAvatarComponent } from './user-avatar.component';

@NgModule({
    imports: [
        CommonModule,
        AvatarModule
    ],
    declarations: [
        UserAvatarComponent
    ],
    exports: [
        UserAvatarComponent
    ]
})
export class UserAvatarModule { }
