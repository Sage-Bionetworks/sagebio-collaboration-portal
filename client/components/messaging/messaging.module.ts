import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'ng2-avatar';
import { ClipboardModule } from 'ngx-clipboard';
import { MaterialModule } from 'components/material/material.module';
import { SidenavModule } from 'components/sidenav/sidenav.module';
import { PipesModule } from '../pipes/pipes.module';
import { UserAvatarModule } from '../user-avatar/user-avatar.module';
import { MessagingService } from './messaging.service';
import { MessageComponent } from './message/message.component';
import { MessageNewComponent } from './message-new/message-new.component';
import { MessageStarArchiveButtonComponent } from './message-star-archive-button/message-star-archive-button.component';
import { MessageStarButtonComponent } from './message-star-button/message-star-button.component';
import { ThreadPreviewComponent} from './thread-preview/thread-preview.component';
import { ThreadSidenavComponent } from './thread-sidenav/thread-sidenav.component';
import { ThreadNewComponent } from './thread-new/thread-new.component';
import { ThreadEditComponent } from './thread-edit/thread-edit.component';
import { ThreadListComponent } from './thread-list/thread-list.component';
import { ThreadDateSeparatorComponent } from './thread-date-separator/thread-date-separator.component';
import { StarredMessageListComponent } from './starred-message-list/starred-message-list.component';
import { MessagingDataService } from './messaging-data.service';
import { MessageDateSeparatorComponent } from './message-date-separator/message-date-separator.component';
import { AppQuillModule } from '../quill/app-quill.module';
import { SocketService } from 'components/socket/socket.service';
import { ThreadComponent } from './thread/thread.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
        SidenavModule,
        AvatarModule,
        ClipboardModule,
        // QuillModule.forRoot({
        //     modules: {
        //         imageDrop: true,
        //         'emoji-shortname': true,
        //         'emoji-textarea': false,
        //         'emoji-toolbar': true,
        //         syntax: true
        //     }
        // }),
        PipesModule,
        UserAvatarModule,
        AppQuillModule
    ],
    providers: [
        MessagingService,
        MessagingDataService,
        SocketService,
    ],
    declarations: [
        MessageComponent,
        MessageNewComponent,
        MessageStarArchiveButtonComponent,
        MessageStarButtonComponent,
        ThreadPreviewComponent,
        ThreadSidenavComponent,
        ThreadNewComponent,
        ThreadEditComponent,
        ThreadListComponent,
        ThreadDateSeparatorComponent,
        StarredMessageListComponent,
        MessageDateSeparatorComponent,
        ThreadComponent
    ],
    exports: [
        ThreadNewComponent,
        ThreadEditComponent,
        MessageComponent,
        MessageNewComponent,
        ThreadListComponent,
        StarredMessageListComponent,
        ThreadComponent
    ],
    entryComponents: [
        // MessageThreadComponent
    ]
})
export class MessagingModule { }
