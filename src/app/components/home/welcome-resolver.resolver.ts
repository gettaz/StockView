import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { AssetSummary } from 'src/app/models/AssetSummary';
import { AssetService } from 'src/app/services/asset.service';
import { inject } from '@angular/core';
import { ChartDataItem } from 'src/app/models/ChartDataItem';
import { ClassificationService } from 'src/app/services/classification.service';

export const welcomeResolverResolver: ResolveFn<ChartDataItem[]> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
   ): Observable<any[]>  => {

    const classificationService = inject(ClassificationService);

    return classificationService.getCategoryDistribution('gh').pipe(
      map((result: any[]) => {
        console.log('Received data from getCategoryDistribution:', result);
        return result.map(item => new ChartDataItem(item.name, item.assetCount));
      }),
      catchError(error => {
        console.error('Error in getCategoryDistribution:', error);
        return of([]); // Return an empty array in case of error
      })
    );
}
