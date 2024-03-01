import { OnInit, Component, ViewChild, TemplateRef, ViewContainerRef, inject, HostListener,ElementRef, ChangeDetectorRef,  } from '@angular/core';
import { Asset } from '../../../models/Asset';
import { Subject, map, firstValueFrom  } from 'rxjs';
import { AssetService } from '../../../services/asset.service';
import { PriceService } from '../../../services/price.service';
import {MatIconModule} from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';
import { Chart, registerables } from 'chart.js';
import { ClassificationService } from '../../../services/classification.service';
import { catchError,  } from 'rxjs/operators';
import { SearchResult } from 'src/app/models/SearchResult';
import { AssetSummary } from '../../../models/AssetSummary';
import { DataTablesModule } from 'angular-datatables';
import { ActivatedRoute } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

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
  displayedColumns: string[] = ['assetName', 'ticker', 'averagePriceBought', 'amount', 'brokerName', 'currentPrice', 'priceSold', 'category', 'gain'];
  expandedAsset: AssetSummary | null = null;
  expandedAssetDetails: Asset[] = [];

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
    '', // category,
    null
  );
  maxDate = new Date();

  assets: AssetSummary[] = [];
  dataSource = new MatTableDataSource<AssetSummary>([]);
  private assetService = inject(AssetService);
  public assetForm!: FormGroup; // Declare the form group
  @ViewChild('expandedDetail', { read: ViewContainerRef }) expansionDetailContainer!: ViewContainerRef;
  @ViewChild('expansionDetailTemplate', { read: TemplateRef }) private expansionDetailTemplate!: TemplateRef<any>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private priceService: PriceService,
    private classificationService: ClassificationService,
    private formBuilder: FormBuilder,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
  ) {}

  get newAsset(): Asset {
    return this._newAsset;
  }

  isRowExpanded(element: any): boolean {
    return this.expandedAsset === element;
  }

  toggleRow(asset: AssetSummary) {
  if (this.expandedAsset === asset) {
    // If the same row is clicked again, collapse it
    this.expandedAsset = null;
    this.expandedAssetDetails = [];
  } else {
    this.expandedAsset = asset;
    console.log("toggleRow");
    // Make an API call to fetch details
    this.assetService.getAssetDetails(asset).subscribe(
      (details: Asset[]) => {
        this.expandedAssetDetails = details; // Assign the emitted value to expandedAssetDetails
      },
      error => {
        console.error('Error fetching asset details:', error);
      }
    );
  }}

  set newAsset(value: Asset) {
    this._newAsset = new Asset(
      value.assetName,
      value.ticker,
      value.purchasePrice,
      value.amount,
      value.brokerName,
      value.dateBought,
      value.dateSold,
      value.currentPrice,
      value.priceSold,
      value.categoryName,
      null
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
    this.dataSource.data = (this.activatedRoute.snapshot.data as any).assets;

    this.dataSource.data.forEach(asset => this.priceService.subscribeToTicker(asset.ticker));

    this.priceService.priceUpdates.subscribe(update => {
      this.dataSource.data.forEach(asset => {
        if (asset.ticker === update.ticker) {
          asset.currentPrice = update.price;
        }
      });
    });

  }

  async onAssetAdded(): Promise<void> {
    if (!this.assetForm.valid) {
      console.error('Form is invalid');
      return;
    }
  
    try {
      // Assuming getCurrentPrice now returns a Promise<number>
      const currentPrice = await firstValueFrom(this.priceService.getCurrentPrice(this.assetForm.value.ticker));
  
      // Create a new instance of Asset using the properties from the form
      const assetToAdd = new Asset(
        this.assetForm.value.assetName,
        this.assetForm.value.ticker,
        this.assetForm.value.priceBought,
        this.assetForm.value.amount,
        this.assetForm.value.brokerName,
        new Date(this.assetForm.value.dateBought),
        this.assetForm.value.dateSold ? new Date(this.assetForm.value.dateSold) : null,
        currentPrice,
        this.assetForm.value.priceSold,
        this.assetForm.value.categoryName,
        null // Placeholder for any additional property
      );
  
      await firstValueFrom(this.assetService.addAsset(assetToAdd));
  
      // This block is executed after successfully adding the asset
      if (this.dataSource.data.some(ass => ass.brokerName == this.assetForm.value.brokerName && ass.category == this.assetForm.value.categoryName)) {
        const localAssetToAdd = new AssetSummary(
          this.assetForm.value.assetName,
          this.assetForm.value.ticker,
          this.assetForm.value.amount,
          this.assetForm.value.priceBought,
          this.assetForm.value.brokerName,
          this.assetForm.value.categoryName,
          currentPrice, // Use the currentPrice from assetToAdd
          undefined // Placeholder for updated current price
        );
  
        this.addAssetToLocalList(localAssetToAdd);
      }
  
      this.resetNewAssetForm();
      this.closeModal();
    } catch (error) {
      console.error('Error:', error);
      // Handle any errors that occurred during getCurrentPrice or addAsset
    }
  }
  

  addAssetToLocalList(asset: AssetSummary): void {
    const currentData = this.dataSource.data;
    if (Array.isArray(currentData)) {
        this.dataSource.data = [...currentData, asset];
    } else {
        console.error('dataSource.data is not an array:', currentData);
        // Initialize dataSource.data to an array with the new asset if it wasn't an array
        this.dataSource.data = [asset];
    }
  }

  onComponentClick(): void {
    // Reset the activeField to hide the dropdowns
    this.activeField = '';
  }
  resetNewAssetForm() {
    this.newAsset = new Asset('', '', 0, 0, '', new Date(), null, 0, null, '', null);
    this.showForm = false;
  }

  onDelete(asset: AssetSummary, subAsset: Asset): void {
    let newAmount = asset.totalAmount - subAsset.amount; 
    let newAverage = (asset.totalAmount * asset.averagePriceBought - subAsset.amount * subAsset.purchasePrice) /  newAmount;
    asset.totalAmount = newAmount;
    asset.averagePriceBought = newAverage;
    this.assetService.removeAsset(subAsset.id!)
    .subscribe(() => {
      
      if(newAmount === 0)
      {
        this.dataSource.data = this.dataSource.data.filter((u) => u !== asset);
        this.expandedAssetDetails = [];
      }
      else
      {
        this.expandedAssetDetails = this.expandedAssetDetails.filter((ex => ex.id != subAsset.id));
      }
    });
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
    this.assetForm.get('categoryName')!.setValue(value);

    this.classifications = []; // Clear the results after selection
    this.assetForm.updateValueAndValidity();
  }
  selectBroker(value: string): void {
    this.assetForm.get('brokerName')!.setValue(value);

    this.newAsset.brokerName = value;
    this.classifications = []; // Clear the results after selection
    this.assetForm.updateValueAndValidity();
  }
  openModal(): void {
    this.expandedAsset = null;
    this.showForm = true;
    document.body.classList.add('body-freeze');

  }
  selectTicker(result: any): void {
    this.assetForm.get('ticker')!.setValue(result.displaySymbol);
    this.assetForm.get('assetName')!.setValue(result.description);
    this.tickerSearchResults = []; // Clear the results after selection
    this.tickerSelected = true;
    this.assetNameSelected = true;
    this.assetForm.updateValueAndValidity();

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
      null, // priceSold - Add this line
      '',
      null
    ); // Reset the new asset object
    
    this.assetForm.reset();
    this.classifications = [];
    this.tickerSearchResults = [];
    document.body.classList.remove('body-freeze');

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
    dateBought: [null, Validators.required]
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

@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent): void {
  // Implement the logic to collapse the expanded row if the click is outside
  if (this.expandedAsset && !this.elementRef.nativeElement.contains(event.target)) {
    this.expandedAsset = null;
    // Add any additional logic you need to handle when collapsing the row
  }
}
}

