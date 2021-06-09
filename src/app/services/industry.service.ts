import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Industry } from '../models/industry';

@Injectable({
  providedIn: 'root'
})
export class IndustryService {

  private REST_API_SERVER = environment.API_SERVER + "/Industry/";

  constructor(private httpClient: HttpClient) { }

  public getDataByDate(date: string){
    const url = this.REST_API_SERVER + date;
    return this.httpClient.get<Industry[]>(url).pipe(
      catchError(this.handleError)
      );
  }

  public getByIndustryName(industryName: string){
    const url = this.REST_API_SERVER + 'GetByIndustryName/'+ industryName;
    return this.httpClient.get<Industry[]>(url).pipe(
      catchError(this.handleError)
      );
  }

  handleError(error: HttpErrorResponse){
    return throwError(error);
    }

}
