import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ProductService {
    private apiUrl = 'http://localhost:5000/api/product';

    constructor(private http: HttpClient) { }

    getAllProducts(): Observable<any> {
        return this.http.get(`${this.apiUrl}`);
    }

    createProduct(product: any): Observable<any> {
        return this.http.post(`${this.apiUrl}`, product);
    }

    updateProduct(product: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${product.id}`, product);
    }

    deleteProduct(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}