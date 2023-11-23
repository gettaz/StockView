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
    {
      assetName: 'AAPL',
      ticker: 'AAPL',
      amount: 100,
      priceBought: 100,
      brokerName: 'Broker 1',
      dateBought: new Date(),
      dateSold: null,
      currentPrice: 0
    },
    {
      assetName: 'Bitcoin',
      ticker: 'BINANCE:BTCUSDT',
      amount: 100,
      priceBought: 100,
      brokerName: 'Broker 1',
      dateBought: new Date(),
      dateSold: null,
      currentPrice: 0
    },
    {
      assetName: 'TQQQ',
      ticker: 'TQQQ',
      amount: 100,
      priceBought: 100,
      brokerName: 'Broker 1',
      dateBought: new Date(),
      dateSold: null,
      currentPrice: 0
    }
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
    0
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
      0
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
      null,
      0 // dateSold
    ); // Reset the new asset objecty
  }
}
