import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SectorStock } from '../models/sector-stock';

@Injectable({
  providedIn: 'root'
})
export class SectorStockService {

  private REST_API_SERVER = environment.API_SERVER + "/SectorStock/";

  constructor(private httpClient: HttpClient) { }

  public getDataByDate(date: string){
    const url = this.REST_API_SERVER + date;
    return this.httpClient.get<SectorStock[]>(url).pipe(
      catchError(this.handleError)
      );
  }

  public getByName(date: string,sectorType: string, sectorName: string, gainer: number){
    const functionName = sectorType === 'sector' ? 'GetBySectorName' : 'GetByIndustryName';
    const url = `${this.REST_API_SERVER}${functionName}/${date}/${sectorName}/${gainer}`;
    return this.httpClient.get<SectorStock[]>(url).pipe(
      catchError(this.handleError)
      );
  }

  handleError(error: HttpErrorResponse){
    return throwError(error);
    }

}
