import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { HttpClient } from '@angular/common/http';
import { AssetService } from '../../services/asset.service';
import { Asset } from '../../models/asset';

@Component({
  selector: 'kod-calculator',
  templateUrl: './deprication-calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {

  @ViewChild(AgGridAngular, { static: true }) agGrid: AgGridAngular;

  columnDefs = [
    {headerName: 'ID', field: 'id', sortable: true, filter: true,filterParams: {
      buttons: ['reset', 'apply'],
    },checkboxSelection: true , editable: true },
    {headerName: 'Asset Number', field: 'assetNumber', sortable: true, filter: true,filterParams: {
      buttons: ['reset', 'apply'],
    }, editable: true, resizable:true },
    {headerName: 'Asset Category', field: 'assetCategoryId', sortable: true, filter: true ,filterParams: {
      buttons: ['reset', 'apply']}, editable: true, resizable:true },
    {headerName: 'Description', field: 'description', sortable: true, filter: true , filterParams: {
        buttons: ['reset', 'apply']}, editable: true , resizable:true  },
    {headerName: 'Date Placed in Service', field: 'dateInService', sortable: true, filter: true , filterParams: {
      buttons: ['reset', 'apply']}, editable: true , resizable:true  },
    {headerName: 'Cost', field: 'cost', sortable: true, filter: true , filterParams: {
       buttons: ['reset', 'apply']}, editable: true , resizable:true  },
    {headerName: 'Business Percentage', field: 'businessPercentage', sortable: true, filter: true , filterParams: {
        buttons: ['reset', 'apply']}, editable: true , resizable:true  },
    {headerName: 'Business Percentage', field: 'businessPercentage', sortable: true, filter: true , filterParams: {
        buttons: ['reset', 'apply']}, editable: true , resizable:true  },
    {headerName: 'Listed Property Type', field: 'listedPropertyTypeId', sortable: true, filter: true , filterParams: {
        buttons: ['reset', 'apply']}, editable: true  , resizable:true },
    {headerName: 'Method', field: 'methodId', sortable: true, filter: true , filterParams: {
        buttons: ['reset', 'apply']}, editable: true , resizable:true  },
    {headerName: 'Life', field: 'life', sortable: true, filter: true , filterParams: {
        buttons: ['reset', 'apply']}, editable: true , resizable:true  },
    {headerName: 'Prior Regular Depreciation', field: 'priorRegDepreciation', sortable: true, filter: true , filterParams: {
        buttons: ['reset', 'apply']}, editable: true , resizable:true  },
    {headerName: 'Prior Bonus Depreciation', field: 'priorBonusDepriciation', sortable: true, filter: true , filterParams: {
        buttons: ['reset', 'apply']}, editable: true , resizable:true  },
    {headerName: 'Prior Sec 179 Expense', field: 'priorExpSec179', sortable: true, filter: true , filterParams: {
        buttons: ['reset', 'apply']}, editable: true , resizable:true  },
    {headerName: 'Property Type (Code Section)', field: 'propertyTypeCodeId', sortable: true, filter: true , filterParams: {
        buttons: ['reset', 'apply']}, editable: true, resizable:true  },
    {headerName: 'If Amortization Code Section', field: 'amortizationCodeId', sortable: true, filter: true , filterParams: {
        buttons: ['reset', 'apply']}, editable: true , resizable:true  },
    {headerName: 'Asset Convention', field: 'assetConvention', sortable: true, filter: true , filterParams: {
        buttons: ['reset', 'apply']}, editable: true , resizable:true  },
    {headerName: 'Current Depreciation', field: 'currentDepriciation', sortable: true, filter: true , filterParams: {
      buttons: ['reset', 'apply']}, editable: true , resizable:true  },
    {headerName: 'Section 179 Expense for Current Year', field: 'currentYearExpSec179', sortable: true, filter: true , filterParams: {
      buttons: ['reset', 'apply']}, editable: true , resizable:true  },
    {headerName: 'Bonus Deprication', field: 'bonusDepriciation', sortable: true, filter: true , filterParams: {
        buttons: ['reset', 'apply']}, editable: true , resizable:true  }
              
           
      
  ];
    /*columnDefs = [  
      {headerName: 'Make', field: 'make', sortable: true, filter: true,filterParams: {
          buttons: ['reset', 'apply'],
        },checkboxSelection: true , editable: true },
      {headerName: 'Model', field: 'model', sortable: true, filter: true , filterParams: {
          buttons: ['reset', 'apply']}, editable: true  },
      {headerName: 'Price', field: 'price', sortable: true, filter: true ,filterParams: {
          buttons: ['reset', 'apply']}, editable: true}
  ];*/
  
  private propTypes: Asset[];


  rowData: any;

  constructor(
    private http: HttpClient,
    private _assetService: AssetService) {
  }

  ngOnInit() {
    this._assetService.getAll().subscribe((proptypes) => {
      this.propTypes = proptypes;
      console.log("prop types", this.propTypes);
      this.rowData = this.propTypes;
      this.agGrid.api.sizeColumnsToFit();
    });


    this.rowData = this.http.get('https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/sample-data/smallRowData.json');
  }

  getSelectedRows() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    const selectedDataStringPresentation = selectedData.map(node => node.make + ' ' + node.model).join(', ');
    alert(`Selected nodes: ${selectedDataStringPresentation}`);
  }
}
