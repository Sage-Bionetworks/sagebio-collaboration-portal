import { NgModule } from '@angular/core';
import { MaterialModule } from 'components/material/material.module';
import { ShowActivityButtonComponent } from './show-activity-button.component';

@NgModule({
  imports: [MaterialModule],
  declarations: [ShowActivityButtonComponent],
  exports: [ShowActivityButtonComponent]
})
export class ShowActivityButtonModule { }