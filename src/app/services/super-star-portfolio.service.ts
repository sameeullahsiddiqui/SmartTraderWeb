import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SuperStarPortfolio } from '../models/super-star-portfolio';

@Injectable({
  providedIn: 'root'
})
export class SuperStarPortfolioService {

  private REST_API_SERVER = environment.API_SERVER + "/SuperStarPortfolio";

  constructor(private httpClient: HttpClient) { }

  getAll(activeOnly: boolean) {
    const url = `${this.REST_API_SERVER}/${activeOnly}` ;
    return this.httpClient.get<SuperStarPortfolio[]>(url).pipe(
      catchError(this.handleError)
      );
  }

  create(data:SuperStarPortfolio): Observable<any> {
    return this.httpClient.post(this.REST_API_SERVER, data);
  }

  update(id:number, data:SuperStarPortfolio): Observable<any> {
    return this.httpClient.put(`${this.REST_API_SERVER}/${id}`, data);
  }

  sync(): Observable<any> {
    return this.httpClient.get(`${this.REST_API_SERVER}/sync`);
  }

  delete(id:number): Observable<any> {
    return this.httpClient.delete(`${this.REST_API_SERVER}/${id}`);
  }

  handleError(error: HttpErrorResponse){
    return throwError(error);
    }

}
