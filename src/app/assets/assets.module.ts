import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AssetListComponent } from './asset-list/asset-list.component';
import { AddAssetModule } from './add-asset/add-asset.module'; // Import the AddAssetModule

@NgModule({
  declarations: [
    AssetListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: AssetListComponent }
    ]),
    AddAssetModule // Include the AddAssetModule here
  ]
})
export class AssetsModule { }
