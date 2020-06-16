import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PropertyTypeCode } from '../models/property-type-code';
import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertyTypeCodeService {

  private baseUrl: string = env.apiBase + 'api/v1/propertytypecodes';

  constructor(private _http:HttpClient) { }

  public getAll(): Observable<PropertyTypeCode[]>{
    return this._http.get<PropertyTypeCode[]>(this.baseUrl);
  }
}
