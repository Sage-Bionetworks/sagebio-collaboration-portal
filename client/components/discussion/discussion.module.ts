import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../components/material/material.module';
import { DiscussionService } from './discussion.service';
import { TagService } from './tag.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule,
    ],
    providers: [
        DiscussionService,
        TagService
    ],
    declarations: [],
    exports: []
})
export class DiscussionModule { }
