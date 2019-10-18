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
import { EntityListComponent } from './entity-list/entity-list.component';
import { EntityListCardComponent } from './entity-list-card/entity-list-card.component';
import { EntityListItemComponent } from './entity-list-item/entity-list-item.component';
import { EntityAttachmentService } from './entity-attachment/entity-attachment.service';
import { EntityAttachmentListComponent } from './entity-attachment/entity-attachment-list/entity-attachment-list.component';

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
        MessagingModule,
    ],
    providers: [EntityAttachmentService],
    declarations: [
        EntityAccessListComponent,
        EntityDangerZoneOptionsComponent,
        EntityListComponent,
        EntityListCardComponent,
        EntityListItemComponent,
        EntityAttachmentListComponent,
    ],
    exports: [
        EntityAccessListComponent,
        EntityDangerZoneOptionsComponent,
        EntityListComponent,
        EntityAttachmentListComponent,
    ],
})
export class EntityModule {}
