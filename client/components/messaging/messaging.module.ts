import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'ng2-avatar';

// import { HighlightModule } from 'ngx-highlightjs';
// import xml from 'highlight.js/lib/languages/xml';
// import scss from 'highlight.js/lib/languages/scss';
// import typescript from 'highlight.js/lib/languages/typescript';

// import hljs from 'highlightjs';
//
// hljs.configure({   // optionally configure hljs
//   languages: ['javascript', 'ruby', 'python']
// });

// import hljs from 'highlight.js';
// hljs.configure({   // optionally configure hljs
//     languages: ['javascript', 'ruby', 'python']
// });

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

// import hljs from 'highlight.js/lib/highlight.js';
//
// hljs.configure({   // optionally configure hljs
//   languages: ['javascript', 'ruby', 'python']
// });

/**
 * Import every language you wish to highlight here
 * NOTE: The name of each language must match the file name its imported from
 */
// export function hljsLanguages() {
//     return [
//         { name: 'typescript', func: typescript },
//         { name: 'scss', func: scss },
//         { name: 'xml', func: xml }
//     ];
// }

import Quill from 'quill';
import { ImageDrop } from 'quill-image-drop-module';
Quill.register('modules/imageDrop', ImageDrop);
import 'quill-emoji.js';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        AppQuillModule,
        MaterialModule,
        SidenavModule,
        AvatarModule,
        // HighlightModule.forRoot({
        //     languages: hljsLanguages
        // }),
        QuillModule.forRoot({
            modules: {
                imageDrop: true,
                'emoji-shortname': true,
                'emoji-textarea': false,
                'emoji-toolbar': true,
                syntax: true,
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
