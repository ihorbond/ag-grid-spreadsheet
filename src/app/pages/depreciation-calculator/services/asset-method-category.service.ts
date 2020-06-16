import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment as env } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AssetMethodCategory } from '../models/asset-method-category';

@Injectable({
  providedIn: 'root'
})
export class AssetMethodCategoryService {
  private baseUrl: string = env.apiBase + 'api/v1/assetmethodcategories';
  
  constructor(private _http: HttpClient) { }

  public getAll(): Observable<AssetMethodCategory[]> {
    return this._http.get<AssetMethodCategory[]>(this.baseUrl);
  }
}
