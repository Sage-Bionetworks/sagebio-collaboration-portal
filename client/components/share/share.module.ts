import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'components/material/material.module';
import { AppQuillModule } from 'components/quill/app-quill.module';

import { ShareButtonComponent } from './share-button/share-button.component';
import { ShareSidenavComponent } from './share-sidenav/share-sidenav.component';

@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    AppQuillModule
  ],
  declarations: [
    ShareButtonComponent,
    ShareSidenavComponent
  ],
  exports: [
    ShareButtonComponent,
    ShareSidenavComponent
  ],
})

export class ShareModule { }
