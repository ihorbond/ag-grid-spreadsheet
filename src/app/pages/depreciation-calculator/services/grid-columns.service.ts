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
import { AssetConventionEnum } from '../enums/asset-convention.enum';

@Injectable({
  providedIn: 'root'
})
export class GridColumnsService {

  private propTypeCodes: PropertyTypeCode[];
  private amortizationCodes: AmortizationCode[];
  private listedPropTypes: ListedPropertyType[];
  private assetCategories: AssetCategory[];
  private assetMethodCategories: AssetMethodCategory[];

  private propTypeCodeMappings;
  private amortizationCodeMappings;
  private listedPropTypeMappings;
  private assetCategoryMappings;
  private assetMethodCategoryMappings;
  private assetConventionMappings;


  constructor(
    private _listedPropTypeService: ListedPropertyTypeService,
    private _amortizationCodeService: AmortizationCodeService,
    private _assetCategoryService: AssetCategoryService,
    private _assetMethodCategoryService: AssetMethodCategoryService,
    private _propertyTypeCodeService: PropertyTypeCodeService
  ) { 
  }

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

      this.propTypeCodeMappings = this.createMapping(this.propTypeCodes, 'id', 'code');
      this.amortizationCodeMappings = this.createMapping(this.amortizationCodes, 'id', 'code');
      this.listedPropTypeMappings = this.createMapping(this.listedPropTypes, 'id', 'description');
      this.assetCategoryMappings = this.createMapping(this.assetCategories, 'id', 'description');
      this.assetMethodCategoryMappings = this.createMapping(this.assetMethodCategories, 'id', 'description');
      this.assetConventionMappings = Object.values(AssetConventionEnum).filter(isNaN).reduce((obj, val) => {
        obj[AssetConventionEnum[val]] = val;
        return obj;
      }, {});

      console.log(this.assetConventionMappings);

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
                    cellEditorParams: { values: this.extractValues(this.assetCategoryMappings) },
                    refData: this.assetCategoryMappings,
                    filterParams: {
                        buttons: ['reset', 'apply']
                    }
                },
                {
                    headerName: 'Description', 
                    field: 'description', 
                    sortable: true, 
                    filter: true, 
                    editable: true, 
                    resizable: true,
                    filterParams: {
                        buttons: ['reset', 'apply']
                    }
                },
                {
                    headerName: 'Date Placed in Service', 
                    field: 'dateInService', 
                    sortable: true, 
                    //filter: true, 
                    filter: 'agDateColumnFilter',
                    filterParams: {
                    comparator: function(filterLocalDateAtMidnight, cellValue) {
                        var dateAsString = cellValue;
                        var dateParts = dateAsString.split('/');
                        var cellDate = new Date(
                        Number(dateParts[2]),
                        Number(dateParts[1]) - 1,
                        Number(dateParts[0])
                        );
                        if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
                        return 0;
                        }
                        if (cellDate < filterLocalDateAtMidnight) {
                        return -1;
                        }
                        if (cellDate > filterLocalDateAtMidnight) {
                        return 1;
                        }
                    },
                    buttons: ['reset', 'apply']
                    },
                    editable: true, 
                    cellEditor: 'datePicker',
                    cellRenderer: 'dateTimeRenderer',
                    resizable: true
                },
                {
                    headerName: 'Cost', 
                    field: 'cost', 
                    sortable: true, 
                    filter: true, 
                    editable: true, 
                    resizable: true, 
                    filterParams: {
                        buttons: ['reset', 'apply']
                    }
                },
                {
                    headerName: 'Business Percentage', 
                    field: 'businessPercentage', 
                    sortable: true, 
                    filter: true, 
                    editable: true, 
                    resizable: true, 
                    filterParams: {
                        buttons: ['reset', 'apply']
                    }, 
                },
                {
                    headerName: 'Listed Property Type', 
                    field: 'listedPropertyTypeId', 
                    sortable: true, 
                    editable: true, 
                    resizable: true, 
                    cellEditor: 'select',
                    cellEditorParams: { values: this.extractValues(this.listedPropTypeMappings) },
                    refData: this.listedPropTypeMappings,
                    filter: true, filterParams: {
                        buttons: ['reset', 'apply']
                    }, 
                },
                {
                    headerName: 'Method', 
                    field: 'methodId', 
                    sortable: true, 
                    editable: true,
                    resizable: true, 
                    cellEditor: 'select',
                    cellEditorParams: { values: this.extractValues(this.assetMethodCategoryMappings) },
                    refData: this.assetMethodCategoryMappings,
                    filter: true, filterParams: {
                        buttons: ['reset', 'apply']
                    }
                },
                {
                    headerName: 'Life', 
                    field: 'life', 
                    sortable: true, 
                    filter: true, 
                    resizable: true, 
                    editable: true, 
                    filterParams: {
                        buttons: ['reset', 'apply']
                    }
                },
                {
                    headerName: 'Prior Regular Depreciation', 
                    field: 'priorRegDepreciation', 
                    sortable: true, 
                    filter: true, 
                    editable: true, 
                    resizable: true, 
                    filterParams: {
                        buttons: ['reset', 'apply']
                    }
                },
                {
                    headerName: 'Prior Bonus Depreciation', 
                    field: 'priorBonusDepriciation', 
                    sortable: true, 
                    filter: true, 
                    editable: true, 
                    resizable: true, 
                    filterParams: {
                        buttons: ['reset', 'apply']
                    }
                },
                {
                    headerName: 'Prior Sec 179 Expense', 
                    field: 'priorExpSec179', 
                    sortable: true, 
                    filter: true, 
                    editable: true, 
                    resizable: true, 
                    filterParams: {
                        buttons: ['reset', 'apply']
                    }
                },
                {
                    headerName: 'Property Type (Code Section)', 
                    field: 'propertyTypeCodeId', 
                    sortable: true, 
                    filter: true, 
                    editable: true, 
                    resizable: true, 
                    cellEditor: 'select',
                    cellEditorParams: { values: this.extractValues(this.propTypeCodeMappings) },
                    refData: this.propTypeCodeMappings,
                    filterParams: {
                      buttons: ['reset', 'apply']
                    }
                },
                {
                    headerName: 'If Amortization Code Section', 
                    field: 'amortizationCodeId', 
                    sortable: true, 
                    editable: true, 
                    resizable: true, 
                    cellEditor: 'select',
                    cellEditorParams: { values: this.extractValues(this.amortizationCodeMappings) },
                    refData: this.amortizationCodeMappings,
                    filter: true, filterParams: {
                        buttons: ['reset', 'apply']
                    }, 
                },
                {
                    headerName: 'Asset Convention', 
                    field: 'conventionId', 
                    sortable: true, 
                    filter: true, 
                    editable: true, 
                    resizable: true,
                    cellEditor: 'select',
                    cellEditorParams: { values: this.extractValues(this.assetConventionMappings) },
                    refData: this.assetConventionMappings,
                    filterParams: {
                        buttons: ['reset', 'apply']
                    }
                },
                {
                    headerName: 'Current Depreciation', 
                    field: 'currentDepriciation', 
                    sortable: true, 
                    filter: true, 
                    editable: true, 
                    resizable: true, 
                    filterParams: {
                        buttons: ['reset', 'apply']
                    }
                },
                {
                    headerName: 'Section 179 Expense for Current Year', 
                    field: 'currentYearExpSec179', 
                    sortable: true,
                    filter: true, 
                    editable: true, 
                    resizable: true, 
                    filterParams: {
                        buttons: ['reset', 'apply']
                    } 
                },
                {
                    headerName: 'Bonus Deprication', 
                    field: 'bonusDepriciation', 
                    sortable: true, 
                    filter: true, 
                    editable: true, 
                    resizable: true,
                    filterParams: {
                        buttons: ['reset', 'apply']
                    }
                }
            ]
        }
      ];
    }));
  }

  private extractValues(mapping: any):string[] {
    return Object.keys(mapping);
  }

  private createMapping(items: any[], key: string, field: string): any {
    return items.reduce((obj, item) => {
      obj[item[key]] = item[field].toString();
      return obj;
    }, {});
  }
}


