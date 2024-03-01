import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssetSummary } from '../models/AssetSummary'; // Adjust the path as necessary
import { map } from 'rxjs/operators';
import { Asset } from '../models/Asset';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  constructor(private http: HttpClient) {}

  getAssetDetails(asset: AssetSummary): Observable<Asset[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI3Mzc4YWY3ZC0xM2Y5LTRkM2EtOTIxMi05YjQ5ODg1MGUzOWYiLCJuYmYiOjE3MDkyMTA4ODYsImV4cCI6MTcwOTM4MzY4NiwiaWF0IjoxNzA5MjEwODg2LCJpc3MiOiJZb3VySXNzdWVyIiwiYXVkIjoiWW91ckF1ZGllbmNlIn0.DuDyhhl6jSqw_sWJECOJVeTU33ae2T3SvWbedulcy74'
    });
    let params = new HttpParams()
    .set('brokerName', asset.brokerName)
    .set('categoryName', asset.category)
    .set('ticker', asset.ticker);
  
    return this.http.get<Asset[]>(`http://localhost:5130/api/assets/filter/Details`, { headers: headers, params: params });
  }

  addAsset(asset: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI3Mzc4YWY3ZC0xM2Y5LTRkM2EtOTIxMi05YjQ5ODg1MGUzOWYiLCJuYmYiOjE3MDkyMTA4ODYsImV4cCI6MTcwOTM4MzY4NiwiaWF0IjoxNzA5MjEwODg2LCJpc3MiOiJZb3VySXNzdWVyIiwiYXVkIjoiWW91ckF1ZGllbmNlIn0.DuDyhhl6jSqw_sWJECOJVeTU33ae2T3SvWbedulcy74'
    });
    return this.http.post(`http://localhost:5130/api/assets`, asset ,{ headers: headers , responseType: 'text' });
  }

  removeAsset(assetId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI3Mzc4YWY3ZC0xM2Y5LTRkM2EtOTIxMi05YjQ5ODg1MGUzOWYiLCJuYmYiOjE3MDkyMTA4ODYsImV4cCI6MTcwOTM4MzY4NiwiaWF0IjoxNzA5MjEwODg2LCJpc3MiOiJZb3VySXNzdWVyIiwiYXVkIjoiWW91ckF1ZGllbmNlIn0.DuDyhhl6jSqw_sWJECOJVeTU33ae2T3SvWbedulcy74'
    });

    return this.http.delete(`http://localhost:5130/api/assets/${assetId}`,{ headers: headers, responseType: 'text' });
  }

  getAssets(userId: string): Observable<AssetSummary[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI3Mzc4YWY3ZC0xM2Y5LTRkM2EtOTIxMi05YjQ5ODg1MGUzOWYiLCJuYmYiOjE3MDkyMTA4ODYsImV4cCI6MTcwOTM4MzY4NiwiaWF0IjoxNzA5MjEwODg2LCJpc3MiOiJZb3VySXNzdWVyIiwiYXVkIjoiWW91ckF1ZGllbmNlIn0.DuDyhhl6jSqw_sWJECOJVeTU33ae2T3SvWbedulcy74'
    });

    return this.http.get<any[]>(`http://localhost:5130/api/Assets/filter/Summary`,{ headers: headers })
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