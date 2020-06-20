import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';

import { GridColumnsService } from '../../services/grid-columns.service';
import { AssetService } from '../../services/asset.service';
import { Asset } from '../../models/asset';

//other
import { DateTimeRenderer } from '../../cellRenderers/DateTimeRenderer';

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

  public rowData: any;
  public columnDefs: any;

  constructor(
    private _assetService: AssetService,
    private _gridColumnsService: GridColumnsService
  ) {}


  ngOnInit() {
    this._gridColumnsService.getColDefs().subscribe(cols => {
      console.log("cols", cols);
      this.columnDefs = cols;
      this.setupGrid();
    });
  }
  
  private setupGrid(): void {
    this._assetService.getAll()
      .subscribe( asset=> this.rowData = asset);
    console.log("assets", this.assets);
    this.agGrid.api.sizeColumnsToFit();
  }

  public getSelectedRows(): void {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    const selectedDataStringPresentation = selectedData.map(node => node.make + ' ' + node.model).join(', ');
    alert(`Selected nodes: ${selectedDataStringPresentation}`);
  }
}
