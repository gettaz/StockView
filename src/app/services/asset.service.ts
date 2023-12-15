import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssetSummary } from '../models/AssetSummary'; // Adjust the path as necessary
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  constructor(private http: HttpClient) {}

  addAsset(userId: string, asset: any): Observable<any> {
    return this.http.post(`http://your-backend-server.com/api/users/${userId}/assets`, asset);
  }

  getAssets(userId: string): Observable<AssetSummary[]> {
    return this.http.get<any[]>(`http://localhost:5130/api/Assets/8c656bc8-c03c-4909-bb0c-a2c4669316b5/assets`)
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
