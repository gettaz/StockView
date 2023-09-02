import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  constructor(private http: HttpClient) {}

  addAsset(userId: string, asset: any): Observable<any> {
    return this.http.post(`http://your-backend-server.com/api/users/${userId}/assets`, asset);
  }

  getAssets(userId: string): Observable<any> {
    return this.http.get(`https://localhost:7114/api/Assets/c3d38378-85d2-4f08-8515-e5874d81ac52/assets`);
  }
}
