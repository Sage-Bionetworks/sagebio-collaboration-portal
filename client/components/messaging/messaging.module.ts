import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'ng2-avatar';
import { MaterialModule } from '../../components/material/material.module';
import { MessagingService } from './messaging.service';
import { MessageComponent } from './message/message.component';
import { TagService } from './tag.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        AvatarModule
    ],
    providers: [
        MessagingService,
        TagService
    ],
    declarations: [
        MessageComponent
    ],
    exports: [
        MessageComponent
    ]
})
export class MessagingModule { }
