import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'ng2-avatar';
import { QuillModule } from 'ngx-quill';

import { AppQuillModule } from '../../components/quill/app-quill.module';
import { MaterialModule } from '../../components/material/material.module';
import { SidenavModule } from '../../components/sidenav/sidenav.module';
import { MessagingService } from './messaging.service';
import { MessageComponent } from './message/message.component';
import { MessageNewComponent } from './message-new/message-new.component';
import { MessageReplyButtonComponent } from './message-reply-button/message-reply-button.component';
import { MessageStarArchiveButtonComponent } from './message-star-archive-button/message-star-archive-button.component';
import { MessageStarButtonComponent } from './message-star-button/message-star-button.component';
import { MessageThreadComponent } from './message-thread/message-thread.component';
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
        SidenavModule,
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
        MessageReplyButtonComponent,
        MessageStarArchiveButtonComponent,
        MessageStarButtonComponent,
        MessageThreadComponent,
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
