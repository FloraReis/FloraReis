import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SupplierService {
    private apiUrl = 'http://localhost:5000/api/supplier';

    constructor(private http: HttpClient) { }

    getAllSuppliers(): Observable<any> {
        return this.http.get(`${this.apiUrl}`);
    }

    createSupplier(supplier: any): Observable<any> {
        return this.http.post(`${this.apiUrl}`, supplier);
    }

    updateSupplier(supplier: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${supplier.id}`, supplier);
    }

    deleteSupplier(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}