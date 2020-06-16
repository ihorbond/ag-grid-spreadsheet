import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AmortizationCode } from '../models/amortization-code';
import { Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AmortizationCodeService {

  private baseUrl: string = env.apiBase + 'api/v1/amortizationcodes';

  constructor(private _http: HttpClient) { }

  public getAll(): Observable<AmortizationCode[]> {
    return this._http.get<AmortizationCode[]>(this.baseUrl);
  }
}
