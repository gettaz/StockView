import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    return this.http.post('http://your-backend-server.com/api/register', userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post('http://your-backend-server.com/api/login', credentials);
  }
}
