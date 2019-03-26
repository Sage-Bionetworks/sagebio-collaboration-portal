import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSliderModule } from '@angular/material/slider';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { PassiveMatCheckboxComponent } from './passive-mat-checkbox/passive-mat-checkbox.component';

import { FlexLayoutModule } from '@angular/flex-layout'; // not part of material

@NgModule({
  imports: [
    MatListModule,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatToolbarModule,
    MatSelectModule,
    MatSidenavModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatGridListModule,
    MatInputModule,
    MatSnackBarModule,
    MatMenuModule,
    MatChipsModule,
    MatCheckboxModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatTabsModule,
    MatSliderModule,

    FormsModule,
    ReactiveFormsModule,

    FlexLayoutModule
  ],
  declarations: [
    // PassiveMatCheckboxComponent
  ],
  exports: [
    MatListModule,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatToolbarModule,
    MatSelectModule,
    MatSidenavModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatGridListModule,
    MatInputModule,
    MatSnackBarModule,
    MatMenuModule,
    MatChipsModule,
    MatCheckboxModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatTabsModule,
    MatSliderModule,

    FormsModule,
    ReactiveFormsModule,

    // PassiveMatCheckboxComponent,

    FlexLayoutModule
  ],
})
export class MaterialModule { }
