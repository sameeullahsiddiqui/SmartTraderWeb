import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StockPrice } from '../models/stock-price';


@Injectable({
  providedIn: 'root'
})
export class StockPriceService {

  private REST_API_SERVER = environment.API_SERVER + "/StockPrice";

  constructor(private httpClient: HttpClient) { }

  public getByName(stockName: string, date: string){
    const url = `${this.REST_API_SERVER}/${stockName}/${date}`;
    return this.httpClient.get<StockPrice[]>(url).pipe(
      catchError(this.handleError)
      );
  }

  public updateIndicators(stockName: string, date: string){
    const url = `${this.REST_API_SERVER}/UpdateIndicators/${stockName}/${date}`;
    return this.httpClient.get<StockPrice[]>(url).pipe(
      catchError(this.handleError)
      );
  }

  public split(symbol: string, date: string, operationType: string, oldFaceValue: number, newFaceValue: number) {
    const url = `${this.REST_API_SERVER}/Split/${symbol}/${date}/${operationType}/${oldFaceValue}/${newFaceValue}`;
    return this.httpClient.get<StockPrice[]>(url).pipe(
      catchError(this.handleError)
      );
  }

  updateEarningReports(year: number) {
    const url = `${this.REST_API_SERVER}/UpdateEarningReports/${year}`;
    return this.httpClient.get<StockPrice[]>(url).pipe(
      catchError(this.handleError)
      );
  }

  handleError(error: HttpErrorResponse){
    return throwError(error);
    }

}
