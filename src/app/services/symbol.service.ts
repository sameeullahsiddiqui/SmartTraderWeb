import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { Symbols } from "../models/symbol";

@Injectable({
  providedIn: 'root'
})
export class SymbolService {

  private REST_API_SERVER = environment.API_SERVER + "/symbol";

  constructor(private httpClient: HttpClient) { }

  public getSymbols(code:any){
    const url =  `${this.REST_API_SERVER}/search/${code}`;
    return this.httpClient.get<string[]>(url).pipe(
      catchError(this.handleError)
      );
  }

  public getCompanyCode(name:any){
    const url =  `${this.REST_API_SERVER}/GetCompanyCode/${name}`;
    return this.httpClient.get<Symbols>(url).pipe(
      catchError(this.handleError)
      );
  }

  update(id:number, data:Symbols): Observable<any> {
    return this.httpClient.put(`${this.REST_API_SERVER}/${id}`, data);
  }

  handleError(error: HttpErrorResponse){
    return throwError(error);
    }

}
