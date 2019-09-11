import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { AppQuillModule } from 'components/quill/app-quill.module';
import { MaterialModule } from 'components/material/material.module';
import { AuthGuard } from 'components/auth/auth-guard.service';
import { FiltersModule } from 'components/filters/filters.module';
import { ActivityModule } from 'components/activity/activity.module';
import { ShareModule } from 'components/share/share.module';
import { InsightListComponent } from './insight-list/insight-list.component';
import { InsightService } from 'components/insight/insight.service';
import { SocketService } from 'components/socket/socket.service';
import { ProvenanceModule } from 'components/provenance/provenance.module';
import { EntityModule } from 'components/entity/entity.module';
import { InsightModule as InsightComponentModule } from 'components/insight/insight.module';

export const ROUTES: Routes = [
    {
        path: 'insights',
        component: InsightListComponent,
        canActivate: [AuthGuard],
        data: {},
    }
];

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterModule.forChild(ROUTES),
        AppQuillModule,
        FiltersModule,
        ShareModule,
        ActivityModule,
        ProvenanceModule,
        EntityModule,
        InsightComponentModule,
    ],
    declarations: [InsightListComponent],
    providers: [SocketService, InsightService],
    exports: [InsightListComponent],
    entryComponents: [],
})
export class InsightModule { }
