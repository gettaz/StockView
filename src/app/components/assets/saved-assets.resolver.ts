import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AssetSummary } from 'src/app/models/AssetSummary';
import { AssetService } from 'src/app/services/asset.service';
import { inject } from '@angular/core';
import { PriceService } from 'src/app/services/price.service';

export const savedAssetsResolver: ResolveFn<AssetSummary[]> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<AssetSummary[]> => {
  const assetService = inject(AssetService);
  const priceService = inject(PriceService);

  return assetService.getAssets('gh').pipe(
    map((data: any[]) => data.map(item => new AssetSummary(
      item.assetName,
      item.ticker,
      item.totalAmount,
      item.averagePriceBought,
      item.brokerName,
      item.category,
      item.priceSold
    ))),
    catchError(error => {
      console.error('Error fetching assets:', error);
      return of([]);
    }) //todo add the getassets observable forkjoin
  );

};
