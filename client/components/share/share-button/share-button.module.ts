import { NgModule } from '@angular/core';
import { MaterialModule } from 'components/material/material.module';
import { ShareButtonComponent } from './share-button.component';

@NgModule({
    imports: [MaterialModule],
    declarations: [ShareButtonComponent],
    exports: [ShareButtonComponent],
})
export class ShareButtonModule {}
