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
import { EntityDangerZoneOptionsComponent } from './entity-danger-zone-options/entity-danger-zone-options.component';
import { EntityDiscussionComponent } from './entity-discussion/entity-discussion.component';
import { EntityListComponent } from './entity-list/entity-list.component';
import { EntityListCardComponent } from './entity-list-card/entity-list-card.component';
import { EntityListItemComponent } from './entity-list-item/entity-list-item.component';

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
    providers: [
        // EntityService
    ],
    declarations: [
        EntityAccessListComponent,
        EntityDangerZoneOptionsComponent,
        EntityDiscussionComponent,
        EntityListComponent,
        EntityListCardComponent,
        EntityListItemComponent,
    ],
    exports: [
        EntityAccessListComponent,
        EntityDangerZoneOptionsComponent,
        EntityDiscussionComponent,
        EntityListComponent,
        // EntityListItemComponent
        // EntityViewComponent
    ]
})
export class EntityModule { }
