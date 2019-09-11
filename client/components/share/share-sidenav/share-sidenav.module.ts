import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'components/material/material.module';
import { ShareSidenavComponent } from './share-sidenav.component';
import { AppQuillModule } from 'components/quill/app-quill.module';

@NgModule({
    imports: [MaterialModule, CommonModule, AppQuillModule],
    declarations: [ShareSidenavComponent],
    exports: [ShareSidenavComponent],
})
export class ShareSidenavModule {}
