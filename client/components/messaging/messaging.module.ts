import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'ng2-avatar';
import { QuillModule } from 'ngx-quill';
import { AppQuillModule } from '../../components/quill/app-quill.module';
import { MaterialModule } from '../../components/material/material.module';
import { SidenavModule } from '../../components/sidenav/sidenav.module';
import { PipesModule } from '../pipes/pipes.module';
import { UserAvatarModule } from '../user-avatar/user-avatar.module';
import { MessagingService } from './messaging.service';
import { MessageComponent } from './message/message.component';
import { MessageNewComponent } from './message-new/message-new.component';
import { MessageReplyButtonComponent } from './message-reply-button/message-reply-button.component';
import { MessageStarArchiveButtonComponent } from './message-star-archive-button/message-star-archive-button.component';
import { MessageStarButtonComponent } from './message-star-button/message-star-button.component';
import { ThreadSidenavComponent } from './thread/thread-sidenav/thread-sidenav.component';
import { MessagingViewComponent } from './messaging-view/messaging-view.component';
import { StarredMessageListComponent } from './starred-message-list/starred-message-list.component';
import { MessagingDataService } from './messaging-data.service';
import { TagService } from '../tag/tag.service';
import { MessageDateSeparatorComponent } from './message-date-separator/message-date-separator.component';

import Quill from 'quill';
import { ImageDrop } from 'quill-image-drop-module';
Quill.register('modules/imageDrop', ImageDrop);
import 'quill-emoji/dist/quill-emoji.js';

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
                imageDrop: true,
                'emoji-shortname': true,
                'emoji-textarea': false,
                'emoji-toolbar': true,
                // syntax: true,
                // toolbar: [...]
            }
        }),
        PipesModule,
        UserAvatarModule
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
        ThreadSidenavComponent,
        MessagingViewComponent,
        StarredMessageListComponent,
        MessageDateSeparatorComponent
    ],
    exports: [
        MessageComponent,
        MessageNewComponent,
        MessagingViewComponent,
        StarredMessageListComponent
    ],
    entryComponents: [
        // MessageThreadComponent
    ]
})
export class MessagingModule { }
