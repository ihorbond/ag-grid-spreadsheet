import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';

import { GridColumnsService } from '../../services/grid-columns.service';
import { AssetService } from '../../services/asset.service';
import { Asset } from '../../models/asset';

//other
import { DateTimeRenderer } from '../../cellRenderers/DateTimeRenderer';
import { forkJoin } from 'rxjs';
import * as $ from "jquery";

@Component({
  selector: 'kod-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {
  @ViewChild(AgGridAngular, { static: true }) agGrid: AgGridAngular;

  frameworkComponents = {
    dateTimeRenderer: DateTimeRenderer
  }

  private assets: Asset[];
  private components;

  public rowData: any;
  public columnDefs: any;

  constructor(
    private _assetService: AssetService,
    private _gridColumnsService: GridColumnsService
  ) { }


  ngOnInit() {
    

    const cols$ = this._gridColumnsService.getColDefs();
    const assets$ = this._assetService.getAll();
    forkJoin(cols$, assets$).subscribe(res => {
      console.log("res", res);
      this.columnDefs = res[0];
      this.rowData = res[1];
      this.components = { datePicker: getDatePicker() };
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


function getDatePicker() {
  function Datepicker() {}
  Datepicker.prototype.init = function(params) {
    this.eInput = document.createElement('input');
    this.eInput.value = params.value;
    this.eInput.classList.add('ag-input');
    this.eInput.style.height = '100%';
    ($(this.eInput) as any).datepicker({ dateFormat: 'dd/mm/yy' });
  };
  Datepicker.prototype.getGui = function() {
    return this.eInput;
  };
  Datepicker.prototype.afterGuiAttached = function() {
    this.eInput.focus();
    this.eInput.select();
  };
  Datepicker.prototype.getValue = function() {
    return this.eInput.value;
  };
  Datepicker.prototype.destroy = function() {};
  Datepicker.prototype.isPopup = function() {
    return false;
  };
  return Datepicker;
}
