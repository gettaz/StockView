import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { AssetSummary } from 'src/app/models/AssetSummary';
import { AssetService } from 'src/app/services/asset.service';
import { PriceService } from 'src/app/services/price.service';
import { inject } from '@angular/core';
import { ChartDataItem } from 'src/app/models/ChartDataItem';
import { ClassificationService } from 'src/app/services/classification.service';
import { TimelineSummary } from 'src/app/models/TimelineSummary';

export const welcomeResolverResolver: ResolveFn<{chartData: ChartDataItem[], timelineData: TimelineSummary[] | null}> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<{chartData: ChartDataItem[], timelineData: TimelineSummary[] | null}> => {

  const classificationService = inject(ClassificationService);
  const priceService = inject(PriceService);
  const userId = 'gh'; // Assuming 'gh' is your user identifier

  // Fetch category distribution
  const categoryDistribution$ = classificationService.getCategoryDistribution(userId).pipe(
    map((result: any[]) => result.map(item => new ChartDataItem(item.name, item.assetCount))),
    catchError(error => {
      console.error('Error in getCategoryDistribution:', error);
      return of([]); // Return an empty array in case of error
    })
  );

  // Fetch timeline data
  const timelineData$ = priceService.fetchTimelineSummary('all').pipe(
    catchError(error => {
      console.error('Error fetching timeline data:', error);
      return of(null); // Return null or an empty object in case of error
    })
  );

  return forkJoin({chartData: categoryDistribution$, timelineData: timelineData$}).pipe(
    map(results => {
      // Here, results is an object with keys 'chartData' and 'timelineData'
      // You may transform or directly return these results as needed for your component
      return results;
    }),
    catchError(error => {
      console.error('Error in resolver:', error);
      return of({chartData: [], timelineData: null}); // Provide fallback values
    })
  );
};
