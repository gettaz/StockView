import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observable } from 'rxjs';
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

  getAssets(userId: string): Promise<AssetSummary[]> {
    return new Promise((resolve, reject) => {
      this.http.get<any[]>(`http://localhost:5130/api/Assets/${userId}/assets`)
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
        )
        .subscribe({
          next: data => resolve(data),
          error: err => reject(err)
        });
    });
  }
}
