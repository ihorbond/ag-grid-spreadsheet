import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatorComponent } from './components/calculator/calculator.component';
import { AgGridModule } from 'ag-grid-angular';



@NgModule({
  declarations: [CalculatorComponent],
  imports: [
    CommonModule,
    AgGridModule.withComponents([]),
  ],
  exports: [CalculatorComponent]
})
export class DepreciationCalculatorModule { }
