import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PersonService {
    private apiUrl = 'http://localhost:5000/api/person';

    constructor(private http: HttpClient) { }

    getAllPersons(): Observable<any> {
        return this.http.get(`${this.apiUrl}`);
    }

    createPerson(person: any): Observable<any> {
        return this.http.post(`${this.apiUrl}`, person);
    }

    updatePerson(person: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${person.id}`, person);
    }

    deletePerson(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}