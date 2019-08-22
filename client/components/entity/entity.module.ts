import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from 'components/material/material.module';
import { UserAvatarModule } from 'components/user-avatar/user-avatar.module';
import { SocketModule } from 'components/socket/socket.module';
import { FiltersModule } from 'components/filters/filters.module';
import { MessagingModule } from 'components/messaging/messaging.module';

import { EntityAccessListComponent } from './entity-access-list/entity-access-list.component';
import { EntityDiscussionComponent } from './entity-discussion/entity-discussion.component';
import { EntityListComponent } from './entity-list/entity-list.component';
import { EntityViewComponent } from './entity-view/entity-view.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        UserAvatarModule,
        SocketModule,
        RouterModule,
        FiltersModule,
        MessagingModule
    ],
    declarations: [
        EntityAccessListComponent,
        EntityDiscussionComponent,
        EntityListComponent,
        EntityViewComponent,
    ],
    exports: [
        EntityAccessListComponent,
        EntityDiscussionComponent,
        EntityListComponent
    ]
})
export class EntityModule { }
