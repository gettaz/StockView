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
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI3Mzc4YWY3ZC0xM2Y5LTRkM2EtOTIxMi05YjQ5ODg1MGUzOWYiLCJuYmYiOjE3MDY5MDY3MjUsImV4cCI6MTcwNzA3OTUyNSwiaWF0IjoxNzA2OTA2NzI1LCJpc3MiOiJZb3VySXNzdWVyIiwiYXVkIjoiWW91ckF1ZGllbmNlIn0.BJPYL_Nxs9R1vMsVL9iexIimz6FBKI6VJ93J6v-2jVk'
    });
    return this.http.get(`http://localhost:5130/api/AssetClassifications/distribution?classificationType=broker` , { headers: headers });
  }
  getCategoryDistribution(userId: string): Observable<any> {
    var headers = new HttpHeaders({
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI3Mzc4YWY3ZC0xM2Y5LTRkM2EtOTIxMi05YjQ5ODg1MGUzOWYiLCJuYmYiOjE3MDY5MDY3MjUsImV4cCI6MTcwNzA3OTUyNSwiaWF0IjoxNzA2OTA2NzI1LCJpc3MiOiJZb3VySXNzdWVyIiwiYXVkIjoiWW91ckF1ZGllbmNlIn0.BJPYL_Nxs9R1vMsVL9iexIimz6FBKI6VJ93J6v-2jVk'
    });
    return this.http.get(`http://localhost:5130/api/AssetClassifications/distribution?classificationType=category`, { headers: headers });
  }
  getAllCategories(term: string): Observable<any> {
    var headers = new HttpHeaders({
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI3Mzc4YWY3ZC0xM2Y5LTRkM2EtOTIxMi05YjQ5ODg1MGUzOWYiLCJuYmYiOjE3MDY5MDY3MjUsImV4cCI6MTcwNzA3OTUyNSwiaWF0IjoxNzA2OTA2NzI1LCJpc3MiOiJZb3VySXNzdWVyIiwiYXVkIjoiWW91ckF1ZGllbmNlIn0.BJPYL_Nxs9R1vMsVL9iexIimz6FBKI6VJ93J6v-2jVk'
    });
    console.log("getAllCategories in ClassificationService", term);

    return this.http.get<any[]>(`http://localhost:5130/api/AssetClassifications/classifications?classificationType=category` , { headers: headers }).pipe(
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
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI3Mzc4YWY3ZC0xM2Y5LTRkM2EtOTIxMi05YjQ5ODg1MGUzOWYiLCJuYmYiOjE3MDY5MDY3MjUsImV4cCI6MTcwNzA3OTUyNSwiaWF0IjoxNzA2OTA2NzI1LCJpc3MiOiJZb3VySXNzdWVyIiwiYXVkIjoiWW91ckF1ZGllbmNlIn0.BJPYL_Nxs9R1vMsVL9iexIimz6FBKI6VJ93J6v-2jVk'
    });
    return this.http.get<any[]>(`http://localhost:5130/api/AssetClassifications/classifications?classificationType=broker`, { headers: headers }).pipe(
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
