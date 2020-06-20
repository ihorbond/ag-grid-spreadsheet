import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Asset } from '../models/asset';
import { Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  private baseUrl: string = env.apiBase + 'api/v1/assets';

  constructor(private _http:HttpClient) { }

  public getAll(): Observable<Asset[]>{
    return this._http.get<Asset[]>(this.baseUrl);
  }

  public getById(id: number): Observable<Asset> {
    return this._http.get<Asset>(`${this.baseUrl}/${id}`);
  }
}

