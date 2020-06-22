import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';

import { GridColumnsService } from '../../services/grid-columns.service';
import { AssetService } from '../../services/asset.service';
import { Asset } from '../../models/asset';

//other
import { DateTimeRenderer } from '../../cellRenderers/DateTimeRenderer';
import { forkJoin } from 'rxjs';
import { getDatePicker } from 'src/app/pages/depreciation-calculator/helpers/datepicker';

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
  public agGridComponents;

  public rowData: any;
  public columnDefs: any;

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

  onBtnExport() {
    var params = getParams();
    if (params.suppressQuotes || params.columnSeparator) {
      alert(
        'NOTE: you are downloading a file with non-standard quotes or separators - it may not render correctly in Excel.'
      );
    }
    this.agGrid.api.exportDataAsCsv(params);
  }
  
  onBtnUpdate() {
    let t = document.querySelector('#csvResult') as HTMLInputElement;
    t.value = this.agGrid.api.getDataAsCsv(
      getParams()
    );
  }
  
  
}
  function getBooleanValue(checkboxSelector) {
  return document.querySelector(checkboxSelector).checked;
  }
  function getValue(inputSelector) {
  var text = document.querySelector(inputSelector).value;
  switch (text) {
    case 'string':
      return (
        'Here is a comma, and a some "quotes". You can see them using the\n' +
        'api.getDataAsCsv() button but they will not be visible when the downloaded\n' +
        'CSV file is opened in Excel because string content passed to\n' +
        'customHeader and customFooter is not escaped.'
      );
    case 'array':
      return [
        [],
        [
          {
            data: {
              value: 'Here is a comma, and a some "quotes".',
              type: 'String',
            },
          },
        ],
        [
          {
            data: {
              value:
                'They are visible when the downloaded CSV file is opened in Excel because custom content is properly escaped (provided that suppressQuotes is not set to true)',
              type: 'String',
            },
          },
        ],
        [
          {
            data: {
              value: 'this cell:',
              type: 'String',
            },
            mergeAcross: 1,
          },
          {
            data: {
              value: 'is empty because the first cell has mergeAcross=1',
              type: 'String',
            },
          },
        ],
        [],
      ];
    case 'none':
      return;
    case 'tab':
      return '\t';
    case 'true':
      return true;
    case 'none':
      return;
    default:
      return text;
  }
  }
  function getParams() {
  return {
    suppressQuotes: getValue('#suppressQuotes'),
    columnSeparator: getValue('#columnSeparator'),
    customHeader: getValue('#customHeader'),
    customFooter: getValue('#customFooter'),
  };
  }

