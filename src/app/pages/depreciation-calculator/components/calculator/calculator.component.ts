import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { HttpClient } from '@angular/common/http';
import { ListedPropertyTypeService } from '../../services/listed-property-type.service';
import { ListedPropertyType } from '../../models/listed-property-type';
import { AssetService } from '../../services/asset.service';
import { Asset } from '../../models/asset';
import { AmortizationCodeService } from '../../services/amortization-code.service';
import { AssetCategoryService } from '../../services/asset-category.service';
import { AssetMethodCategoryService } from '../../services/asset-method-category.service';
import { PropertyTypeCodeService } from '../../services/property-type-code.service';
import { forkJoin } from 'rxjs';
import { PropertyTypeCode } from '../../models/property-type-code';
import { AssetCategory } from '../../models/asset-category';
import { AssetMethodCategory } from '../../models/asset-method-category';
import { AmortizationCode } from '../../models/amortization-code';
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
  /*columnDefs = [
      {headerName: 'Id', field: 'id', sortable: true, filter: true ,filterParams: {
          buttons: ['reset', 'apply'],
        },checkboxSelection: true , editable: true ,resizable: true ,suppressSizeToFit: false},
      {headerName: 'Description', field: 'description', sortable: true, filter: true , filterParams: {
          buttons: ['reset', 'apply']}, editable: true, resizable: true ,suppressSizeToFit: false  },
      {headerName: 'Asset', field: 'asset', sortable: true, filter: true ,filterParams: {
          buttons: ['reset', 'apply']}, editable: true, resizable: true ,suppressSizeToFit: false}
  ];*/
  columnDefs = [
    {headerName: 'ID', field: 'id', sortable: true, filter: true,filterParams: {
      buttons: ['reset', 'apply'],
    }/*,checkboxSelection: true*/ , editable: true,cellEditor: 'select', },
    {headerName: 'Asset Number', field: 'assetNumber', sortable: true, filter: true,filterParams: {
      buttons: ['reset', 'apply'],
    }, editable: true, resizable:true ,cellEditor: 'select'},
    {headerName: 'Asset Category', field: 'assetCategoryId', sortable: true, filter: true ,filterParams: {
      buttons: ['reset', 'apply']}, editable: true, resizable:true,cellEditor: 'select' },
    {headerName: 'Description', field: 'description', sortable: true, filter: true , filterParams: {
        buttons: ['reset', 'apply']}, editable: true , resizable:true ,cellEditor: 'select' },
    {headerName: 'Date Placed in Service', field: 'dateInService', sortable: true, filter: true , filterParams: {
      buttons: ['reset', 'apply']}, editable: true , resizable:true ,cellEditor: 'select',cellRenderer: 'dateTimeRenderer'},
    {headerName: 'Cost', field: 'cost', sortable: true, filter: true , filterParams: {
       buttons: ['reset', 'apply']}, editable: true , resizable:true ,cellEditor: 'select' },
    {headerName: 'Business Percentage', field: 'businessPercentage', sortable: true, filter: true , filterParams: {
        buttons: ['reset', 'apply']}, editable: true , resizable:true ,cellEditor: 'select' },
    {headerName: 'Business Percentage', field: 'businessPercentage', sortable: true, filter: true , filterParams: {
        buttons: ['reset', 'apply']}, editable: true , resizable:true  ,cellEditor: 'select'},
    {headerName: 'Listed Property Type', field: 'listedPropertyTypeId', sortable: true, filter: true , filterParams: {
        buttons: ['reset', 'apply']}, editable: true  , resizable:true ,cellEditor: 'select'},
    {headerName: 'Method', field: 'methodId', sortable: true, filter: true , filterParams: {
        buttons: ['reset', 'apply']}, editable: true , resizable:true ,cellEditor: 'select' },
    {headerName: 'Life', field: 'life', sortable: true, filter: true , filterParams: {
        buttons: ['reset', 'apply']}, editable: true , resizable:true ,cellEditor: 'select' },
    {headerName: 'Prior Regular Depreciation', field: 'priorRegDepreciation', sortable: true, filter: true , filterParams: {
        buttons: ['reset', 'apply']}, editable: true , resizable:true ,cellEditor: 'select' },
    {headerName: 'Prior Bonus Depreciation', field: 'priorBonusDepriciation', sortable: true, filter: true , filterParams: {
        buttons: ['reset', 'apply']}, editable: true , resizable:true ,cellEditor: 'select' },
    {headerName: 'Prior Sec 179 Expense', field: 'priorExpSec179', sortable: true, filter: true , filterParams: {
        buttons: ['reset', 'apply']}, editable: true , resizable:true ,cellEditor: 'select' },
    {headerName: 'Property Type (Code Section)', field: 'propertyTypeCodeId', sortable: true, filter: true , filterParams: {
        buttons: ['reset', 'apply']}, editable: true, resizable:true ,cellEditor: 'select' },
    {headerName: 'If Amortization Code Section', field: 'amortizationCodeId', sortable: true, filter: true , filterParams: {
        buttons: ['reset', 'apply']}, editable: true , resizable:true ,cellEditor: 'select' },
    {headerName: 'Asset Convention', field: 'assetConvention', sortable: true, filter: true , filterParams: {
        buttons: ['reset', 'apply']}, editable: true , resizable:true ,cellEditor: 'select' },
    {headerName: 'Current Depreciation', field: 'currentDepriciation', sortable: true, filter: true , filterParams: {
      buttons: ['reset', 'apply']}, editable: true , resizable:true  ,cellEditor: 'select'},
    {headerName: 'Section 179 Expense for Current Year', field: 'currentYearExpSec179', sortable: true, filter: true , filterParams: {
      buttons: ['reset', 'apply']}, editable: true , resizable:true  ,cellEditor: 'select'},
    {headerName: 'Bonus Deprication', field: 'bonusDepriciation', sortable: true, filter: true , filterParams: {
        buttons: ['reset', 'apply']}, editable: true , resizable:true ,cellEditor: 'select' }
              
           
      
  ];

  //private propTypes: ListedPropertyType[];
  private assets: Asset[];
  private propTypeCodes: PropertyTypeCode[];
  private amortizationCodes: AmortizationCode[];
  private listedPropTypes: ListedPropertyType[];
  private assetCategories: AssetCategory[];
  private assetMethodCategories: AssetMethodCategory[];
  private assetid2 : Asset[];

  public rowData: any;

  constructor(
    private _assetService: AssetService,
    private _listedPropTypeService: ListedPropertyTypeService,
    private _amortizationCodeService: AmortizationCodeService,
    private _assetCategoryService: AssetCategoryService,
    private _assetMethodCategoryService: AssetMethodCategoryService,
    private _propertyTypeCodeService: PropertyTypeCodeService,
  ) {}


  ngOnInit() {
    this.loadData();
  }

  private loadData(): void {
    const propTypeCodes$ = this._propertyTypeCodeService.getAll();
    const amortizationCodes$ = this._amortizationCodeService.getAll();
    const listedPropTypes$ = this._listedPropTypeService.getAll();
    const assetCategories$ = this._assetCategoryService.getAll();
    const assetMethodCat$ = this._assetMethodCategoryService.getAll();
    const assets$ = this._assetService.getAll();
    const assetid$ = this._assetService.getById(2);
    forkJoin(propTypeCodes$, amortizationCodes$, listedPropTypes$, assetCategories$, assetMethodCat$, assets$,assetid$).subscribe(res => {
      console.log("data", res);
      this.propTypeCodes = res[0];
      this.amortizationCodes = res[1];
      this.listedPropTypes = res[2];
      this.assetCategories = res[3];
      this.assetMethodCategories = res[4];
      this.assets = res[5];
      this.assetid2 = res[6];
      console.log("assets", this.assets);
      console.log("assetid", this.assetid2);
      this.setupGrid();
    });
  }

  private setupGrid(): void {
    this.rowData = this.assets;
    this.agGrid.api.sizeColumnsToFit();
  }

  public getSelectedRows(): void {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    const selectedDataStringPresentation = selectedData.map(node => node.make + ' ' + node.model).join(', ');
    alert(`Selected nodes: ${selectedDataStringPresentation}`);
  }
}
