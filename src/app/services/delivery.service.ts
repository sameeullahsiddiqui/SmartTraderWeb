import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Delivery } from '../models/delivery';


@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  private REST_API_SERVER = environment.API_SERVER + "/Delivery/";

  constructor(private httpClient: HttpClient) { }

  public getDataByDate(date: string, deliveryOnly:boolean){
    const url =  `${this.REST_API_SERVER}${date}/${deliveryOnly}`;
    return this.httpClient.get<Delivery[]>(url).pipe(
      catchError(this.handleError)
      );
  }

  handleError(error: HttpErrorResponse){
    return throwError(error);
    }

}
