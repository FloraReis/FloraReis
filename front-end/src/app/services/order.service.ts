import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  createOrder(order: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/order`, order);
  }

  getAllOrders(params?: any): Observable<any> {
    const options = params ? { params: new HttpParams({ fromObject: params }) } : {};
    return this.http.get(`${this.apiUrl}/order`, options);
  }

  updateOrder(order: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/order/${order.id}`, order);
  }

  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/order/${id}`);
  }
}
