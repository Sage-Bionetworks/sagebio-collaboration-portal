import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'ng2-avatar';
import { QuillModule } from 'ngx-quill';
import { MaterialModule } from '../../components/material/material.module';
import { MessagingService } from './messaging.service';
import { MessageComponent } from './message/message.component';
import { MessageNewComponent } from './message-new/message-new.component';
import { TagService } from '../tag/tag.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        AvatarModule,
        QuillModule.forRoot({
            modules: {
                // syntax: true,
                // toolbar: [...]
            }
        }),
    ],
    providers: [
        MessagingService
    ],
    declarations: [
        MessageComponent,
        MessageNewComponent
    ],
    exports: [
        MessageComponent,
        MessageNewComponent
    ]
})
export class MessagingModule { }
