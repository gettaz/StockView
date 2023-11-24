import { Component, OnInit } from '@angular/core';
import { Asset } from '../../../models/Asset';
import { Subject } from 'rxjs';
import { AssetService } from '../../../services/asset.service';
import { PriceService } from '../../../services/price.service';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.css']
})
export class AssetListComponent implements OnInit {
  private searchTerms = new Subject<string>();

  assets: Asset[] = [
    new Asset(
      'AAPL', 'AAPL', 100, 100, 'Broker 1', new Date(), null, 0, null
    ),
    new Asset(
      'Bitcoin', 'BINANCE:BTCUSDT', 100, 100, 'Broker 1', new Date(), null, 0, 40000
    ),
    new Asset(
      'TQQQ', 'TQQQ', 100, 40, 'Broker 1', new Date(), null, 0, null
    )
  ];
  tickerSearchResults: any[] = []; // Array to store search results

  constructor(private assetService: AssetService,
     private priceService: PriceService) {console.log("ctor for asset list");
  }

  showForm = false;
  newAsset: Asset = new Asset(
    '', // assetName
    '', // ticker
    0,  // priceBought
    0,  // amount
    '', // brokerName
    new Date(), // dateBought
    null, // dateSold
    0,   // currentPrice
    null // priceSold - Add this line
  );

  ngOnInit(): void {
  
      // Debounce search term input before making the API call
      this.searchTerms.pipe(
        debounceTime(300),        // Wait 300ms after each keystroke before considering the term
        distinctUntilChanged(),   // Ignore if next search term is same as previous
        switchMap((term: string) => this.priceService.searchTickers(term)),
      ).subscribe(results => {
        this.tickerSearchResults = results.result.slice(0, 5); // Keep only top 5 results
        console.log('Search results my array:', this.tickerSearchResults); // Update the list of suggestions
        console.log('Search results my results:', results); // Update the list of suggestions

      });
    
    // Comment out the service call and use hardcoded assets
    /*
    this.assetService.getAssets('userId').subscribe(
      (assets: Asset[]) => {
        this.assets = assets;
        this.assets.forEach(asset => {
          this.priceService.subscribeToTicker(asset.ticker);
          this.priceService.getCurrentPrice(asset.ticker);
        });
      },
      (error) => {
        console.error('Error fetching assets:', error);
      }
    );
    */

    // Hardcoded assets are already initialized, so no need to fetch from service
    this.assets.forEach(asset => {
      this.priceService.subscribeToTicker(asset.ticker);
      this.priceService.getCurrentPrice(asset.ticker);
    });

    // You can still keep the subscription to price updates if needed
    this.priceService.priceUpdates.subscribe(
      update => {
        console.log('Price update received:', update);
        const assetToUpdate = this.assets.find(asset => asset.ticker === update.ticker);
        if (assetToUpdate) {
          assetToUpdate.currentPrice = update.price;
        }
      }
    );
  }

  onAssetAdded(): void {
    
    this.assets.push(this.newAsset);
    this.priceService.subscribeToTicker(this.newAsset.ticker);
  
    this.newAsset = new Asset(
      '', // assetName
      '', // ticker
      0,  // priceBought
      0,  // amount
      '', // brokerName
      new Date(), // dateBought
      null, // dateSold
      0,   // currentPrice
      null // priceSold - Add this line
    ); // Reset the new asset object
  }
  searchTicker(term: string): void {
    console.log("searchTicker", term);
    this.searchTerms.next(term);
  }
  openModal(): void {
    this.showForm = true;
  }
  selectTicker(result: any): void {
    this.newAsset.ticker = result.displaySymbol;
    this.tickerSearchResults = []; // Clear the results after selection
  }
  closeModal(): void {
    this.showForm = false;
    this.newAsset = new Asset(
      '', // assetName
      '', // ticker
      0,  // priceBought
      0,  // amount
      '', // brokerName
      new Date(), // dateBought
      null, // dateSold
      0,   // currentPrice
      null // priceSold - Add this line
    ); // Reset the new asset object
  }
}
