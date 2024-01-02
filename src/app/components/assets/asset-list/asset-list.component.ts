import { Component, OnInit, inject } from '@angular/core';
import { Asset } from '../../../models/Asset';
import { Subject } from 'rxjs';
import { AssetService } from '../../../services/asset.service';
import { PriceService } from '../../../services/price.service';

import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';
import { Chart, registerables } from 'chart.js';
import { ClassificationService } from '../../../services/classification.service';
import { catchError } from 'rxjs/operators';
import { SearchResult } from 'src/app/models/SearchResult';
import { AssetSummary } from '../../../models/AssetSummary';
import { DataTablesModule } from 'angular-datatables';
import { ActivatedRoute } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

Chart.register(...registerables);

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.css'],
})
export class AssetListComponent implements OnInit {
[x: string]: any;
  private searchTerms = new Subject<{ term: string }>();
  private userSearchBrokers = new Subject<string>();
  private userSearchCategory = new Subject<string>();

  classifications: string[] = []; // This will store the classifications names
  private userCategories = new Subject<{ term: string }>();
  tickerSearchResults: SearchResult[] = []; // Array to store search results
  dtOptions: DataTables.Settings = {};
  public activeField: string | null = null;
  public assetNameSelected = false;
  public tickerSelected = false;
    private _newAsset: Asset = new Asset(
    '', // assetName
    '', // ticker
    0, // priceBought
    0, // amount
    '', // brokerName
    new Date(), // dateBought
    null, // dateSold
    0, // currentPrice
    null, // priceSold - Add this line
    '' // category
  );

  assets: AssetSummary[] = [];
  private assetService = inject(AssetService);
  public assetForm!: FormGroup; // Declare the form group

  constructor(
    private activatedRoute: ActivatedRoute,
    private priceService: PriceService,
    private classificationService: ClassificationService,
    private formBuilder: FormBuilder
  ) {}

  get newAsset(): Asset {
    return this._newAsset;
  }

  set newAsset(value: Asset) {
    this._newAsset = new Asset(
      value.assetName,
      value.ticker,
      value.priceBought,
      value.amount,
      value.brokerName,
      value.dateBought,
      value.dateSold,
      value.currentPrice,
      value.priceSold,
      value.category
    );
  }
  showForm = false;

  ngOnInit() {
    this.initializeForm();

    this.priceService.initializeWebSocket();
    // Debounce search term input before making the API call
    this.searchTerms
      .pipe(
        debounceTime(300), // Wait 300ms after each keystroke before considering the term
        distinctUntilChanged(), // Ignore if next search term is same as previous
        switchMap(({ term }) => this.priceService.searchTickers(term))
      )
      .subscribe((results) => {
        console.log('searchTicker back', results);
        this.tickerSearchResults = results.slice(0, 5); // Keep only top 5 results
      });

    this.userSearchBrokers
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => this.classificationService.getAllBrokers(term))
      )
      .subscribe({
        next: (results: string[]) => {
          console.log('userSearchBrokers back', results);
          this.classifications = results.slice(0, 5); // Store top 5 results
        },
        error: (err) => console.error('Subscription error:', err),
      });

    this.userSearchCategory
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => this.classificationService.getAllCategories(term))
      )
      .subscribe({
        next: (results: string[]) => {
          console.log('userSearchCategory back', results);
          this.classifications = results.slice(0, 5); // Store top 5 results
        },
        error: (err) => console.error('Subscription error:', err),
      });
    this.assets = (this.activatedRoute.snapshot.data as any).assets;

    this.assets.forEach(asset => this.priceService.subscribeToTicker(asset.ticker));

    this.priceService.priceUpdates.subscribe(update => {
      this.assets.forEach(asset => {
        if (asset.ticker === update.ticker) {
          asset.currentPrice = update.price;
        }
      });
    });

  }

  onAssetAdded(): void {

    if (!this.assetForm.valid) {
      console.error('Form is invalid');
      return;
    }
    this.priceService.getCurrentPrice(this.newAsset.ticker).subscribe(
      (currentPrice: number) => {
        console.log('Current price for:', this.newAsset.ticker, currentPrice);

        // Create a new instance of Asset using the properties of newAsset
        const assetToAdd = new Asset(
          this.newAsset.assetName,
          this.newAsset.ticker,
          this.newAsset.priceBought,
          this.newAsset.amount,
          this.newAsset.brokerName,
          new Date(this.newAsset.dateBought),
          this.newAsset.dateSold ? new Date(this.newAsset.dateSold) : null,
          currentPrice, // updated current price
          this.newAsset.priceSold,
          this.newAsset.category
        );
        this.priceService.subscribeToTicker(assetToAdd.ticker);

        // Add the newly created Asset instance to the assets array
        // this.assets.push(assetToAdd);

        // Reset newAsset after adding the asset
        this.resetNewAssetForm();
        this.closeModal();
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
  onComponentClick(): void {
    // Reset the activeField to hide the dropdowns
    this.activeField = '';
  }
  resetNewAssetForm() {
    this.newAsset = new Asset('', '', 0, 0, '', new Date(), null, 0, null);
    this.showForm = false;
  }

  searchTicker(value: string, field: string): void {
    
    if(field =='ticker')
    {
        this.tickerSelected = false;
    }
    else{
      this.assetNameSelected = false;
    }
    this.activeField = field;
    this.searchTerms.next({ term: value });
  }

  searchBroker(value: string): void {
    this.activeField = 'broker';
    this.userSearchBrokers.next(value);
    console.info('searchBroker', this.classifications);
  }

  searchCategory(value: string): void {
    this.activeField = 'category';
    this.userSearchCategory.next(value);
    console.info('searchCategory', this.classifications);
  }
  selectCategory(value: string): void {
    this.newAsset.category = value;
    this.classifications = []; // Clear the results after selection
  }
  selectBroker(value: string): void {
    this.newAsset.brokerName = value;
    this.classifications = []; // Clear the results after selection
  }
  openModal(): void {
    this.showForm = true;
  }
  selectTicker(result: any): void {
    this.assetForm.get('ticker')!.setValue(result.displaySymbol);
    this.assetForm.get('assetName')!.setValue(result.description);
    this.tickerSearchResults = []; // Clear the results after selection
    this.tickerSelected = true;
    this.assetNameSelected = true;
    setTimeout(() => document.getElementById('priceBought')?.focus(), 0);
  }
  closeModal(): void {
    this.showForm = false;
    this.newAsset = new Asset(
      '', // assetName
      '', // ticker
      0, // priceBought
      0, // amount
      '', // brokerName
      new Date(), // dateBought
      null, // dateSold
      0, // currentPrice
      null // priceSold - Add this line
    ); // Reset the new asset object

    this.classifications = [];
    this.tickerSearchResults = [];
  }

  //TODO: on destroy should unsubscribe - take untill
  ngOnDestroy() {
    this.priceService.priceUpdates.complete();
    this.userSearchBrokers.complete();
    this.userSearchCategory.complete();
    this.searchTerms.complete();
    this.priceService.closeWebSocket();

}
private initializeForm(): void {
  this.assetForm = this.formBuilder.group({
    assetName: ['', Validators.required],
    ticker: ['', Validators.required],
    priceBought: [0, [Validators.required, Validators.min(0.01)]],
    amount: [0, [Validators.required, Validators.min(1)]],
    brokerName: ['', Validators.required],
    categoryName: ['', Validators.required],
    selectionCheck: [null, this.selectionValidator()]
  })
}

public selectionValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!this.assetNameSelected || !this.tickerSelected ) {
      return { 'selectionNotMade': true };
    }
    return null;
  };
}
isNameNotEmpty(nametype: string): boolean {
  return this.assetForm.get(nametype)?.value.trim() !== '';
}
}

