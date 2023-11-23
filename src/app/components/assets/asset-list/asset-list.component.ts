import { Component, OnInit } from '@angular/core';
import { Asset } from '../../../models/Asset';
import { AssetService } from '../../../services/asset.service';
import { PriceService } from '../../../services/price.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.css']
})
export class AssetListComponent implements OnInit {
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

  openModal(): void {
    this.showForm = true;
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
