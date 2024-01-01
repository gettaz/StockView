import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { AssetSummary } from 'src/app/models/AssetSummary';
import { AssetService } from 'src/app/services/asset.service';
import { inject } from '@angular/core';
import { PriceService } from 'src/app/services/price.service';

export const savedAssetsResolver: ResolveFn<AssetSummary[]> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<any[]> => {
  const assetService = inject(AssetService);
  const priceService = inject(PriceService);

  return assetService.getAssets('gh').pipe(
    switchMap((assets: any[]) => {
      const assetObservables = assets.map(asset => {
        return priceService.getCurrentPrice(asset.ticker).pipe(
          map(price => {
            return new AssetSummary(
              asset.assetName,
              asset.ticker,
              asset.totalAmount,
              asset.averagePriceBought,
              asset.brokerName,
              asset.category,
              asset.currentPrice = price, // Assuming this is where you want to put the price
              asset.priceSold
            );
          }),
          catchError(error => {
            console.error('Error fetching price for asset:', asset.ticker, error);
            return of(null); // Handle error for individual asset price fetch
          })
        );
      });

      return forkJoin(assetObservables);
    }),
    catchError(error => {
      console.error('Error fetching assets:', error);
      return of([]);
    })
  );
};
