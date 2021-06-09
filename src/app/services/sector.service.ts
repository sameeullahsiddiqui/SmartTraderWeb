import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Sector } from '../models/sector';

@Injectable({
  providedIn: 'root'
})
export class SectorService {

  private REST_API_SERVER = environment.API_SERVER + "/Sector/";

  constructor(private httpClient: HttpClient) { }

  public getDataByDate(date: string){
    const url = this.REST_API_SERVER + date;
    return this.httpClient.get<Sector[]>(url).pipe(
      catchError(this.handleError)
      );
  }

  public getBySectorName(sectorName: string){
    const url = this.REST_API_SERVER + 'GetBySectorName/'+ sectorName;
    return this.httpClient.get<Sector[]>(url).pipe(
      catchError(this.handleError)
      );
  }

  handleError(error: HttpErrorResponse){
    return throwError(error);
    }

}
