import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AssetListComponent } from './asset-list.component';
import { AddAssetModule } from '../add-asset/add-asset.module';

@NgModule({
  declarations: [
    AssetListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AddAssetModule, // Import the AddAssetModule
    RouterModule.forChild([
      { path: '', component: AssetListComponent }
    ])
  ]
})
export class AssetListModule { }
