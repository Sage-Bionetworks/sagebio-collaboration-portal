import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from 'components/material/material.module';
import { UserAvatarModule } from 'components/user-avatar/user-avatar.module';
import { SocketModule } from 'components/socket/socket.module';
import { EntityAccessListComponent } from './entity-access-list/entity-access-list.component';
import { FiltersModule } from 'components/filters/filters.module';

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
    ],
    declarations: [
        EntityAccessListComponent,
        EntityListComponent,
        EntityViewComponent,
    ],
    exports: [
        EntityAccessListComponent,
        EntityListComponent
    ]
})
export class EntityModule { }
