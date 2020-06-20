import { Injectable } from '@angular/core';
import { ListedPropertyTypeService } from './listed-property-type.service';
import { AmortizationCodeService } from './amortization-code.service';
import { AssetCategoryService } from './asset-category.service';
import { AssetMethodCategoryService } from './asset-method-category.service';
import { PropertyTypeCodeService } from './property-type-code.service';

import { PropertyTypeCode } from '../models/property-type-code';
import { AmortizationCode } from '../models/amortization-code';
import { ListedPropertyType } from '../models/listed-property-type';
import { AssetCategory } from '../models/asset-category';
import { AssetMethodCategory } from '../models/asset-method-category';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class GridColumnsService {

  private propTypeCodes: PropertyTypeCode[];
  private amortizationCodes: AmortizationCode[];
  private listedPropTypes: ListedPropertyType[];
  private assetCategories: AssetCategory[];
  private assetMethodCategories: AssetMethodCategory[];

  constructor(
    private _listedPropTypeService: ListedPropertyTypeService,
    private _amortizationCodeService: AmortizationCodeService,
    private _assetCategoryService: AssetCategoryService,
    private _assetMethodCategoryService: AssetMethodCategoryService,
    private _propertyTypeCodeService: PropertyTypeCodeService
  ) { }

  public getColDefs(): Observable<any> {
    
    const propTypeCodes$ = this._propertyTypeCodeService.getAll();
    const amortizationCodes$ = this._amortizationCodeService.getAll();
    const listedPropTypes$ = this._listedPropTypeService.getAll();
    const assetCategories$ = this._assetCategoryService.getAll();
    const assetMethodCat$ = this._assetMethodCategoryService.getAll();

    return forkJoin(propTypeCodes$, amortizationCodes$, listedPropTypes$, assetCategories$, assetMethodCat$).pipe(map(res => {
      this.propTypeCodes = res[0];
      this.amortizationCodes = res[1];
      this.listedPropTypes = res[2];
      this.assetCategories = res[3];
      this.assetMethodCategories = res[4];

      return [
        {
            headerName: 'Federal Depreciation',
            children: [
                {
                    headerName: 'ID',
                    field: 'id',
                    sortable: true,
                    filter: true,
                    editable: false,
                    filterParams: {
                        buttons: ['reset', 'apply'],
                    }
                },
                {
                    headerName: 'Asset Number',
                    field: 'assetNumber',
                    sortable: true, 
                    filter: true, 
                    editable: true, 
                    resizable: true, 
                    filterParams: {
                        buttons: ['reset', 'apply'],
                    }
                },
                {
                    headerName: 'Asset Category', 
                    field: 'assetCategoryId', 
                    sortable: true, 
                    filter: true, 
                    editable: true, 
                    resizable: true, 
                    cellEditor: 'select',
                    refData: this.createMapping(this.assetCategories, 'id', 'description'),
                    filterParams: {
                        buttons: ['reset', 'apply']
                    }
                },
                {
                    headerName: 'Description', field: 'description', sortable: true, filter: true, filterParams: {
                        buttons: ['reset', 'apply']
                    }, editable: true, resizable: true, cellEditor: 'select'
                },
                {
                    headerName: 'Date Placed in Service', field: 'dateInService', sortable: true, filter: true, filterParams: {
                        buttons: ['reset', 'apply']
                    }, editable: true, resizable: true, cellEditor: 'select', cellRenderer: 'dateTimeRenderer'
                },
                {
                    headerName: 'Cost', field: 'cost', sortable: true, filter: true, filterParams: {
                        buttons: ['reset', 'apply']
                    }, editable: true, resizable: true, cellEditor: 'select'
                },
                {
                    headerName: 'Business Percentage', field: 'businessPercentage', sortable: true, filter: true, filterParams: {
                        buttons: ['reset', 'apply']
                    }, editable: true, resizable: true, cellEditor: 'select'
                },
                {
                    headerName: 'Listed Property Type', field: 'listedPropertyTypeId', sortable: true, filter: true, filterParams: {
                        buttons: ['reset', 'apply']
                    }, editable: true, resizable: true, cellEditor: 'select'
                },
                {
                    headerName: 'Method', field: 'methodId', sortable: true, filter: true, filterParams: {
                        buttons: ['reset', 'apply']
                    }, editable: true, resizable: true, cellEditor: 'select'
                },
                {
                    headerName: 'Life', field: 'life', sortable: true, filter: true, filterParams: {
                        buttons: ['reset', 'apply']
                    }, editable: true, resizable: true, cellEditor: 'select'
                },
                {
                    headerName: 'Prior Regular Depreciation', field: 'priorRegDepreciation', sortable: true, filter: true, filterParams: {
                        buttons: ['reset', 'apply']
                    }, editable: true, resizable: true, cellEditor: 'select'
                },
                {
                    headerName: 'Prior Bonus Depreciation', field: 'priorBonusDepriciation', sortable: true, filter: true, filterParams: {
                        buttons: ['reset', 'apply']
                    }, editable: true, resizable: true, cellEditor: 'select'
                },
                {
                    headerName: 'Prior Sec 179 Expense', field: 'priorExpSec179', sortable: true, filter: true, filterParams: {
                        buttons: ['reset', 'apply']
                    }, editable: true, resizable: true, cellEditor: 'select'
                },
                {
                    headerName: 'Property Type (Code Section)', 
                    field: 'propertyTypeCodeId', 
                    sortable: true, 
                    filter: true, 
                    editable: true, 
                    resizable: true, 
                    cellEditor: 'select',
                    refData: this.createMapping(this.propTypeCodes, 'id', 'code'),
                    filterParams: {
                      buttons: ['reset', 'apply']
                    }
                },
                {
                    headerName: 'If Amortization Code Section', field: 'amortizationCodeId', sortable: true, filter: true, filterParams: {
                        buttons: ['reset', 'apply']
                    }, editable: true, resizable: true, cellEditor: 'select'
                },
                {
                    headerName: 'Asset Convention', field: 'assetConvention', sortable: true, filter: true, filterParams: {
                        buttons: ['reset', 'apply']
                    }, editable: true, resizable: true, cellEditor: 'select'
                },
                {
                    headerName: 'Current Depreciation', field: 'currentDepriciation', sortable: true, filter: true, filterParams: {
                        buttons: ['reset', 'apply']
                    }, editable: true, resizable: true, cellEditor: 'select'
                },
                {
                    headerName: 'Section 179 Expense for Current Year', field: 'currentYearExpSec179', sortable: true, filter: true, filterParams: {
                        buttons: ['reset', 'apply']
                    }, editable: true, resizable: true, cellEditor: 'select'
                },
                {
                    headerName: 'Bonus Deprication', field: 'bonusDepriciation', sortable: true, filter: true, filterParams: {
                        buttons: ['reset', 'apply']
                    }, editable: true, resizable: true, cellEditor: 'select'
                }
            ]
        }
      ];
    }));
  }

  private createMapping(items: any, key: string, field: string): void {
    return items.reduce((obj, item) => {
      obj[item[key]] = item[field].toString();
      return obj;
    }, {}) as any;
  }

}
