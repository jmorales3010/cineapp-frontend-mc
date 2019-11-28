import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule, MatTableModule, MatFormFieldModule, MatInputModule, MatIconModule, MatPaginatorModule, MatDividerModule, MatSidenavModule, MatMenuModule, MatToolbarModule, MatSortModule, MatDialogModule, MatSnackBarModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatCardModule, MatSlideToggleModule, MatStepperModule, MatGridListModule, MatListModule, MatCheckboxModule, MatChipsModule, MAT_DATE_LOCALE, MatTabsModule} from '@angular/material';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule, 
    MatPaginatorModule,
    MatDividerModule,
    MatSidenavModule,
    MatMenuModule,
    MatToolbarModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatGridListModule,
    MatListModule,
    MatCheckboxModule,
    MatChipsModule
  ],
  exports:[
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule, 
    MatPaginatorModule,
    MatDividerModule,
    MatSidenavModule,
    MatMenuModule,
    MatToolbarModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatGridListModule,
    MatListModule,
    MatCheckboxModule,
    MatChipsModule,
    MatTabsModule
  ],
    providers:[
      { provide: MAT_DATE_LOCALE, useValue: 'es-ES'}
    ]
})
export class MaterialModule { }
