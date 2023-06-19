import { Component } from '@angular/core';

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.css']
})
export class AssetListComponent {
  assets = [
    {
      name: 'Asset 1',
      ticker: 'A1',
      holdings: 100,
      quantity: 50,
      currentPrice: 200,
      priceBought: 100,
      overallInvestment: 5000,
      gain: 1000,
      val: 20,
      broker: 'Broker 1',
      category: 'Category 1'
    },
    // ... more asset data
  ];

  showForm = false;
  newAsset: any = {};

  onAssetAdded(): void {
    this.assets.push(this.newAsset);
    this.closeModal();
  }

  openModal(): void {
    this.showForm = true;
  }

  closeModal(): void {
    this.showForm = false;
    this.newAsset = {}; // Reset the new asset object
  }
}