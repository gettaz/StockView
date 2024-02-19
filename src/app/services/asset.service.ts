import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssetSummary } from '../models/AssetSummary'; // Adjust the path as necessary
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  constructor(private http: HttpClient) {}

  addAsset(asset: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI3Mzc4YWY3ZC0xM2Y5LTRkM2EtOTIxMi05YjQ5ODg1MGUzOWYiLCJuYmYiOjE3MDc1NjIyNzUsImV4cCI6MTcwNzczNTA3NSwiaWF0IjoxNzA3NTYyMjc1LCJpc3MiOiJZb3VySXNzdWVyIiwiYXVkIjoiWW91ckF1ZGllbmNlIn0.vHkWcNBvyPVQ_3TD_pIQR1wc1cTJmglqazBtyjS6U0w'
    });
    return this.http.post(`http://localhost:5130/api/Assets/assets`, asset ,{ headers: headers });
  }

  getAssets(userId: string): Observable<AssetSummary[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI3Mzc4YWY3ZC0xM2Y5LTRkM2EtOTIxMi05YjQ5ODg1MGUzOWYiLCJuYmYiOjE3MDc1NjIyNzUsImV4cCI6MTcwNzczNTA3NSwiaWF0IjoxNzA3NTYyMjc1LCJpc3MiOiJZb3VySXNzdWVyIiwiYXVkIjoiWW91ckF1ZGllbmNlIn0.vHkWcNBvyPVQ_3TD_pIQR1wc1cTJmglqazBtyjS6U0w'
    });

    return this.http.get<any[]>(`http://localhost:5130/api/Assets/assets`,{ headers: headers })
      .pipe(
        map((data: any[]) => data.map(item => new AssetSummary(
          item.assetName,
          item.ticker,
          item.totalAmount,
          item.averagePriceBought,
          item.brokerName,
          item.category,
          item.priceSold
        )))
      );
  }
}