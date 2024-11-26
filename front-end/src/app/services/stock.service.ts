import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class StockService {
    private apiUrl = 'http://localhost:5000/api/stock';

    constructor(private http: HttpClient) { }

    getAllStocks(): Observable<any> {
        return this.http.get(`${this.apiUrl}`);
    }

    createStock(stock: any): Observable<any> {
        return this.http.post(`${this.apiUrl}`, stock);
    }

    updateStock(stock: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${stock.id}`, stock);
    }

    deleteStock(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}