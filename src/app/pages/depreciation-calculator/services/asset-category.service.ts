import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AssetCategory } from '../models/asset-category';


@Injectable({
  providedIn: 'root'
})
export class AssetCategoryService {

  private baseUrl: string = env.apiBase + 'api/v1/assetcategories';

  constructor(private _http: HttpClient) { }
  
  public getAll(): Observable<AssetCategory[]> {
    return this._http.get<AssetCategory[]>(this.baseUrl);
  }

  public getByID(): Observable<AssetCategory[]> {
    return this._http.get<AssetCategory[]>(this.baseUrl);
  }
}
