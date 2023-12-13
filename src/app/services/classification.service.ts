import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClassificationService {
  constructor(private http: HttpClient) {}

  getBrokerDistribution(userId: string,): Observable<any> {
    return this.http.get(`http://localhost:5130/api/AssetClassifications/8c656bc8-c03c-4909-bb0c-a2c4669316b5?classificationType=broker`);
  }
  getCategoryDistribution(userId: string): Observable<any> {
    return this.http.get(`http://localhost:5130/api/AssetClassifications/8c656bc8-c03c-4909-bb0c-a2c4669316b5?classificationType=category`);
  }
  getAllCategories(userId: string): Observable<any> {
    return this.http.get(`http://localhost:5130/api/AssetClassifications/8c656bc8-c03c-4909-bb0c-a2c4669316b5/classifications?classificationType=category`);
  }

  getAllBrokers(term: string): Observable<string[]> {
    console.log("getAllBrokers in ClassificationService", term);

    return this.http.get<any[]>(`https://localhost:44336/api/AssetClassifications/8c656bc8-c03c-4909-bb0c-a2c4669316b5/classifications?classificationType=broker`).pipe(
      tap((response: any) => console.log('Broker search results:', response)),
      map((brokers: string[]) => {
        if (term.trim()) {
          // Filter names that include the term
          return brokers.filter(name => name.toLowerCase().includes(term.toLowerCase()));
        } else {
          // Return all broker names if term is empty
          return brokers;
        }
      }),
      catchError((error) => {
        console.error('Error fetching brokers:', error);
        throw (error);
      })
    );
  }
}
