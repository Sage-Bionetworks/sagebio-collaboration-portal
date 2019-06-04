import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'ng2-avatar';
import { QuillModule } from 'ngx-quill';
import { AppQuillModule } from '../../components/quill/app-quill.module';
import { MaterialModule } from '../../components/material/material.module';
import { MessagingService } from './messaging.service';
import { MessageComponent } from './message/message.component';
import { MessageNewComponent } from './message-new/message-new.component';
import { MessageStarButtonComponent } from './message-star-button/message-star-button.component';
import { MessagingViewComponent } from './messaging-view/messaging-view.component';
import { StarredMessageListComponent } from './starred-message-list/starred-message-list.component';

import { MessagingDataService } from './messaging-data.service';
import { TagService } from '../tag/tag.service';


@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        AppQuillModule,
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
        MessagingService,
        MessagingDataService
    ],
    declarations: [
        MessageComponent,
        MessageNewComponent,
        MessageStarButtonComponent,
        MessagingViewComponent,
        StarredMessageListComponent
    ],
    exports: [
        MessageComponent,
        MessageNewComponent,
        MessagingViewComponent,
        StarredMessageListComponent
    ]
})
export class MessagingModule { }
