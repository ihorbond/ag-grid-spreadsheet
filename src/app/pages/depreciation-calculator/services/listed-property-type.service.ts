import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ListedPropertyType } from '../models/listed-property-type';
import { Observable } from 'rxjs/internal/Observable';
import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListedPropertyTypeService {
  
  private baseUrl: string = env.apiBase + 'api/v1/listedpropertytypes';
  
  constructor(private _http: HttpClient) { }

  public getAll(): Observable<ListedPropertyType[]> {
    return this._http.get<ListedPropertyType[]>(this.baseUrl);
  }
}
