import { Component, OnInit } from '@angular/core';
import { Asset } from '../../../models/Asset';
import { DbService } from '../../../services/db.service';
import { Observable } from 'rxjs';
import { DocumentReference } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.css']
})

export class AssetListComponent implements OnInit {
  assets : Asset[] = [
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
  ];
  
  showForm = false;
  newAsset: Asset = new Asset(
    '', '', 0, 0, 0, 0, 0, 0, 0, '', ''
  );

  constructor(private dbService: DbService) {}

  ngOnInit(): void {
    this.loadAssets();
  }

  loadAssets(): void {
    this.dbService.getAssets().subscribe((assets: Asset[]) => {
      this.assets = assets;
    });
  }

  onAssetAdded(): void {
    //TODO: add userid
    this.dbService.addAsset("1" ,this.newAsset).then(
      (documentRef: DocumentReference<Asset>) => {
        // Process the returned document reference here
        console.log(documentRef);
      },
      (error) => {
        // Handle any errors that occurred during the addition
        console.error('Error adding asset:', error);
      }
    );
  }

  openModal(): void {
    this.showForm = true;
  }

  closeModal(): void {
    this.showForm = false;
    this.newAsset = new Asset(
      '', '', 0, 0, 0, 0, 0, 0, 0, '', ''
    ); // Reset the new asset object
  }
}
