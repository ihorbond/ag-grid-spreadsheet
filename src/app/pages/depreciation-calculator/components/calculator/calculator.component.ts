import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { GridColumnsService } from '../../services/grid-columns.service';
import { AssetService } from '../../services/asset.service';
import { DateTimeRenderer } from '../../cell-renderers/datetime-renderer';
import { forkJoin } from 'rxjs';
import { getDatePicker } from 'src/app/pages/depreciation-calculator/helpers/datepicker';

@Component({
  selector: 'kod-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
})
export class CalculatorComponent implements OnInit {
  @ViewChild(AgGridAngular, { static: true }) agGrid: AgGridAngular;

  public agGridComponents;
  public rowData: any;
  public columnDefs: any;
  public frameworkComponents = {
    dateTimeRenderer: DateTimeRenderer
  }

  constructor(
    private _assetService: AssetService,
    private _gridColumnsService: GridColumnsService
  ) { 
    this.agGridComponents = { datePicker: getDatePicker() };
  }

  ngOnInit() {
    const cols$ = this._gridColumnsService.getColDefs();
    const assets$ = this._assetService.getAll();
    forkJoin(cols$, assets$).subscribe(res => {
      console.log("res", res);
      this.columnDefs = res[0];
      this.rowData = res[1];
      this.agGrid.api.sizeColumnsToFit();
    }, console.error);
  }

  public getSelectedRows(): void {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    const selectedDataStringPresentation = selectedData.map(node => node.make + ' ' + node.model).join(', ');
    alert(`Selected nodes: ${selectedDataStringPresentation}`);
  }
  
}
