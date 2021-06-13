import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Portfolio } from '../models/portfolio';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  private REST_API_SERVER = environment.API_SERVER + "/Portfolio";

  constructor(private httpClient: HttpClient) { }

  getAll() {
    const url = `${this.REST_API_SERVER}` ;
    return this.httpClient.get<Portfolio[]>(url).pipe(
      catchError(this.handleError)
      );
  }

  getAllByStatus(status: string) {
    const url = `${this.REST_API_SERVER}/${status}` ;
    return this.httpClient.get<Portfolio[]>(url).pipe(
      catchError(this.handleError)
      );
  }

  getByName(stockName: string) {
    const url = `${this.REST_API_SERVER}/GetAllByName/${stockName}` ;
    return this.httpClient.get<Portfolio[]>(url).pipe(
      catchError(this.handleError)
      );
  }

  SyncPortfolio(status: string) {
    const url = `${this.REST_API_SERVER}/SyncPortfolio/${status}` ;
    return this.httpClient.get<Portfolio[]>(url).pipe(
      catchError(this.handleError)
      );
  }

  create(data:Portfolio): Observable<any> {
    return this.httpClient.post(this.REST_API_SERVER, data);
  }

  update(id:string, data:Portfolio): Observable<any> {
    return this.httpClient.put(`${this.REST_API_SERVER}/${id}`, data);
  }

  sync(): Observable<any> {
    return this.httpClient.get(`${this.REST_API_SERVER}/sync`);
  }

  delete(id:string): Observable<any> {
    return this.httpClient.delete(`${this.REST_API_SERVER}/${id}`);
  }

  handleError(error: HttpErrorResponse){
    return throwError(error);
    }

}
