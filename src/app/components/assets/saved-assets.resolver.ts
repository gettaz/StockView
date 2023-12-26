import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {inject } from '@angular/core';
import {take, mergeMap, of, EMPTY, Observable} from 'rxjs';
import { AssetSummary } from 'src/app/models/AssetSummary';
import { AssetService } from 'src/app/services/asset.service';

export const savedAssetsResolver: ResolveFn<AssetSummary> =
 (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const assetService = inject(AssetService);

  return assetService.getAssets('hi').pipe
  (
    take(1),
    mergeMap((userAssets) =>
    {
      if(userAssets)
      {
        return of(userAssets);
      }
      else{
        return EMPTY;
      }
    } )
  );
};
