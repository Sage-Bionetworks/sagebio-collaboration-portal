import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../components/material/material.module';
// import { ThemePickerModule } from '../../components/theme-picker/theme-picker.module';
import { NavbarUserButtonModule } from '../../components/navbar-user-button/navbar-user-button.module';
// import { NavbarSearchModule } from '../../components/navbar-search/navbar-search.module';
import { NavbarComponent } from './navbar.component';
// import { ImageModule } from '../../components/image/image.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    // ThemePickerModule,
    NavbarUserButtonModule,
    // NavbarSearchModule,
    // ImageModule
  ],
  declarations: [NavbarComponent],
  exports: [NavbarComponent]
})
export class NavbarModule { }
