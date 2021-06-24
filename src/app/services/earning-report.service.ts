import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { EarningReport } from '../models/earning-report';


@Injectable({
  providedIn: 'root'
})
export class EarningReportService {

  private REST_API_SERVER = environment.API_SERVER + "/EarningReport";

  constructor(private httpClient: HttpClient) { }

  public getAll(){
    const url =  `${this.REST_API_SERVER}`;
    return this.httpClient.get<EarningReport[]>(url).pipe(
      catchError(this.handleError)
      );
  }

  public getDataByDate(date: string, EarningReportOnly:boolean){
    const url =  `${this.REST_API_SERVER}/${date}`;
    return this.httpClient.get<EarningReport[]>(url).pipe(
      catchError(this.handleError)
      );
  }

  update(id: number, data: EarningReport): Observable<any> {
    return this.httpClient.put(`${this.REST_API_SERVER}/${id}`, data);
  }
  handleError(error: HttpErrorResponse){
    return throwError(error);
    }

}
