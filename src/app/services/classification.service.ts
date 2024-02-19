import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClassificationService {
  constructor(private http: HttpClient) {

  }

  getBrokerDistribution(userId: string,): Observable<any> {
   
    var headers = new HttpHeaders({
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI3Mzc4YWY3ZC0xM2Y5LTRkM2EtOTIxMi05YjQ5ODg1MGUzOWYiLCJuYmYiOjE3MDc5MTI5MjcsImV4cCI6MTcwODA4NTcyNiwiaWF0IjoxNzA3OTEyOTI3LCJpc3MiOiJZb3VySXNzdWVyIiwiYXVkIjoiWW91ckF1ZGllbmNlIn0.6yXMWodN2edMkaVM_CKsKwkB-3IGsw9xS699K4lUaMw'
    });
    return this.http.get(`http://localhost:5130/api/AssetClassifications/distribution?classificationType=broker` , { headers: headers });
  }
  getCategoryDistribution(userId: string): Observable<any> {
    var headers = new HttpHeaders({
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI3Mzc4YWY3ZC0xM2Y5LTRkM2EtOTIxMi05YjQ5ODg1MGUzOWYiLCJuYmYiOjE3MDc5MTI5MjcsImV4cCI6MTcwODA4NTcyNiwiaWF0IjoxNzA3OTEyOTI3LCJpc3MiOiJZb3VySXNzdWVyIiwiYXVkIjoiWW91ckF1ZGllbmNlIn0.6yXMWodN2edMkaVM_CKsKwkB-3IGsw9xS699K4lUaMw'
    });
    return this.http.get(`http://localhost:5130/api/AssetClassifications/distribution?classificationType=category`, { headers: headers });
  }
  getAllCategories(term: string): Observable<any> {
    var headers = new HttpHeaders({
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI3Mzc4YWY3ZC0xM2Y5LTRkM2EtOTIxMi05YjQ5ODg1MGUzOWYiLCJuYmYiOjE3MDc5MTI5MjcsImV4cCI6MTcwODA4NTcyNiwiaWF0IjoxNzA3OTEyOTI3LCJpc3MiOiJZb3VySXNzdWVyIiwiYXVkIjoiWW91ckF1ZGllbmNlIn0.6yXMWodN2edMkaVM_CKsKwkB-3IGsw9xS699K4lUaMw'
    });
    console.log("getAllCategories in ClassificationService", term);

    return this.http.get<any[]>(`http://localhost:5130/api/AssetClassifications/classification?classificationType=category` , { headers: headers }).pipe(
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
    );  }

  getAllBrokers(term: string): Observable<string[]> {
    console.log("getAllBrokers in ClassificationService", term);
    var headers = new HttpHeaders({
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI3Mzc4YWY3ZC0xM2Y5LTRkM2EtOTIxMi05YjQ5ODg1MGUzOWYiLCJuYmYiOjE3MDc5MTI5MjcsImV4cCI6MTcwODA4NTcyNiwiaWF0IjoxNzA3OTEyOTI3LCJpc3MiOiJZb3VySXNzdWVyIiwiYXVkIjoiWW91ckF1ZGllbmNlIn0.6yXMWodN2edMkaVM_CKsKwkB-3IGsw9xS699K4lUaMw'
    });
    return this.http.get<any[]>(`http://localhost:5130/api/AssetClassifications/classification?classificationType=broker`, { headers: headers }).pipe(
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
